import url from 'url';
import http from 'http'
import https from 'https'

import HeaderUtil from './header_util';
import Util from './util';

let HttpClient = function (options) {
  this.options = options;
  this.logger = options.logger;
}

HttpClient.prototype.isIgnoredType = function(contentType) {
  return Util.regExArrayContains(this.options.ignoreContentType, contentType);
}

HttpClient.prototype.fetch = function (requestOptions, outputBuffer) {
  let self = this;
  let protocolHandler = requestOptions.port == 443 ? https : http;

  return new Promise(function(resolve, reject) {
    let req = protocolHandler.request(requestOptions, function(res) {
      let statusCode = res.statusCode;
      if (HeaderUtil.isText(res.headers['content-type'])) {
        self._accumulateResponse(res, requestOptions, resolve, reject);
      } else {
        if (!self.isIgnoredType(requestOptions.headers.accept)) {
          self.logger.warn('Non Textual Content-Type Detected...Piping Response from Source Server.');
        }
        self._pipeResonse(res, outputBuffer, resolve, reject);
      }
    });

    if (requestOptions.body) {
      if (requestOptions.headers['content-type'].match('application/json')) {
        req.write(JSON.stringify(requestOptions.body));
      } else {
        req.write(requestOptions.body);
      }
    }
    req.end()

    req.on('error', function (error) {
      let isIgnoredContentType = self.isIgnoredType(requestOptions.headers.accept)
      switch (error.code) {
        case 'ENOTFOUND':
          if (!isIgnoredContentType) {
            self.logger.debug('Unable to Connect to Host.');
            self.logger.debug('Check the Domain Spelling and Try Again.');
            self.logger.debug('No Data Saved for Request.');
          }
          break;
      }
      if (!isIgnoredContentType) {
        reject(error);
      } else {
        reject(false);
      }
    });
  });
}


HttpClient.prototype._pipeResonse = function (res, outputBuffer, resolve, reject) {
  let contentType = res.headers['content-type'];
  let statusCode = res.statusCode
  res.pipe(outputBuffer);

  resolve({
    status: statusCode,
    type: contentType,
    headers: res.headers,
    piped: true
  });
}


HttpClient.prototype._accumulateResponse = function (res, options, resolve, reject) {
  let contentType = res.headers['content-type'];
  let statusCode = res.statusCode;
  let responseData = '';
  res.on('data', function (chunk) {
    responseData += chunk;
  });

  res.on('end', function() {
    let isJson = contentType === 'application/json';
    resolve({
      request: options,
      status: statusCode,
      type: contentType || 'text/plain',
      headers: res.headers,
      data: options.method == 'OPTIONS' ? responseData : (isJson ? Util.parseJSON(responseData) : responseData)
    });
  });

  res.on('error', function () {
    reject('Unable to load data from request.');
  });
}

export default HttpClient;
