/**
 * Core that determines wether to fetch a fresh copy from the source or
 * fetch a cached copy of the data.
 */
import fs from 'fs';
import url from 'url';

import Colorize from './colorize';
import CacheClient from './cache_client';
import FormDataHandler from './form_data';
import HttpClient from './http_client';
import HeaderUtil from './header_util';
import Logger from './logger';
import TransactionState from './transaction_state';
import Util from './util';

var logger = new Logger();

var Mockingjay = function(options) {
  this.options = options;
  this.options.logger = logger;
  logger.setLevel(options.logLevel);

  this.cacheClient = new CacheClient(options);
  this.httpClient = new HttpClient(options);
  this.transactionState = new TransactionState(options.transitionConfig);
}

/**
 * Determine if we have request cached.
 */
Mockingjay.prototype.knows = function(request) {
  return this.cacheClient.isCached(request);
};

/**
 * Fetch a Request form cache.
 */
Mockingjay.prototype.repeat = function(request) {
  logger.info(Colorize.yellow('Repeating'), JSON.stringify(request));
  return this.cacheClient.fetch(request);
};

/**
 * Fetch a Request form the Source.
 */
Mockingjay.prototype.learnOrPipe = function(request, outputBuffer) {
  if (this.options.readOnly) {
    return Promise.reject('Read Only Mode. Missing Fixture for: \n' + JSON.stringify(request));
  }

  logger.info(Colorize.red('Learning'), JSON.stringify(request));
  var self = this;
  var responsePromise = this.httpClient.fetch(request, outputBuffer);
  return responsePromise.then(function (response) {
    if (request.method == 'OPTIONS' || self._okToCache(response.headers['content-type'])) {
      return self.cacheClient.record(request, response);
    } else {
      return Promise.resolve(response);
    }
  }, function (error) {
    return Promise.reject(error);
  });
};


Mockingjay.prototype._okToCache = function (responseType) {
  // Ok to Cache when the Response Type is not in the ignore list.
  return !Util.regExArrayContains(this.options.ignoreContentType, responseType);
};


/**
 * Function that echos the response back to the client.
 * Within this function we determine if we need to learn
 * or need to fetch a fresh response.
 */
Mockingjay.prototype.echo = function(request, outputBuffer) {
  var self = this;
  var shouldRepeat = this.knows(request) && !this.options.refresh;
  var responsePromise = shouldRepeat ? this.repeat(request) : this.learnOrPipe(request, outputBuffer);
  self.recordToRequestResponseLog('Hash', this.cacheClient.requestHash(request));
  self.recordToRequestResponseLog('Request', Util.stringify(request));
  responsePromise.then(function(response) {
    logger.info('Responding:', response.status, response.type);
    self.recordToRequestResponseLog('Response', Util.stringify(response),  {end: true});
    if (!response.piped) {
      var responseString = typeof(response.data) === 'string' ? response.data : Util.stringify(response.data);
      if (HeaderUtil.isText(response.type)) {
        logger.info(responseString);
      }

      if (response.type) {
        outputBuffer.writeHead(response.status, {'Content-Type': response.type});
      }

      outputBuffer.end(responseString);

      if (self.transactionState.isStateful(request.path, request.method)) {
        logger.info('Stateful Transaction Detected. Saving Key for Defined Requests');
        self.transactionState.set(request.path, request.method, self.cacheClient.requestHash(request));
      }
    }
  }, function (error) {
    logger.debug(error.toString());
    self.recordToRequestResponseLog('Response', error.toString(), {end: true});
    outputBuffer.writeHead(500, {'Content-Type': 'text/plain'});
    outputBuffer.end('Error:' + error.toString());
  });
};


Mockingjay.prototype.recordToRequestResponseLog = function(key, value, additionalOptions) {
  additionalOptions = additionalOptions || {end: false};
  if (!this.options.requestResponseLogFile) {
    return;
  }
  var line = key + ': ' + value + '\n' + (additionalOptions.end ? '\n' : '');
  fs.appendFile(this.options.requestResponseLogFile, line, (err) => {
    if (err) throw err;
  });
}


/**
 * Callback that is called when the server recieves a request.
 */
Mockingjay.prototype.onRequest = function(request, response) {
  logger.info(Colorize.green('Request Received'), request.url, request.method);
  var simplifiedRequest = this.simplify(request);
  var corsHeaders = HeaderUtil.getCorsHeaders(request.headers.origin);

  for (var corsHeader in corsHeaders) {
    response.setHeader(corsHeader, corsHeaders[corsHeader]);
  }

  request.on('data', (data) => {
    simplifiedRequest.body += data;
  });

  request.on('end', () => {
    if (FormDataHandler.isFormData(simplifiedRequest.headers)) {
      simplifiedRequest = FormDataHandler.updateBoundary(simplifiedRequest);
    }

    if (simplifiedRequest.headers['content-type'] === 'application/json') {
      simplifiedRequest.body = Util.parseJSON(simplifiedRequest.body);
    }
    this.echo(simplifiedRequest, response);
  });
};


Mockingjay.prototype.simplify = function (request) {
  var urlSplit = url.parse(this.options.serverBaseUrl + request.url);
  var isHttps = urlSplit.protocol === 'https:'
  var options = {
    hostname: urlSplit.hostname,
    port: parseInt(urlSplit.port) || (isHttps ? 443 : 80),
    path: urlSplit.path,
    body: '',
    method: request.method,
    headers: HeaderUtil.standardize(request.headers),
    transaction: this.transactionState.get(urlSplit.path, request.method)
  };
  return options;
};

export default Mockingjay;
