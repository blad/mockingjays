import url from 'url';
import http, { request } from 'http'
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
  let protocolHandler = requestOptions.port == 443 ? https : http;

  return new Promise((resolve, reject) => {
    let onConnectionEstablished = this._onRequestEstablished(requestOptions, outputBuffer, resolve, reject);
    let onErrorConnecting = this._onRequestError(requestOptions, resolve, reject)
    let request = protocolHandler.request(requestOptions, onConnectionEstablished);
    request.on('error', onErrorConnecting);
    if (requestOptions.body) {
      request.write(this._getFormattedRequestBody(requestOptions));
    }
    request.end()
  });
}


HttpClient.prototype._getFormattedRequestBody = function(requestOptions) {
  if (requestOptions.headers['content-type'].match('application/json')) {
    return JSON.stringify(requestOptions.body);
  }
  return requestOptions.body;
}


HttpClient.prototype._onRequestEstablished = function(requestOptions, outputBuffer, resolve, reject) {
  return (res) => {
    let {headers} = res;

    if (HeaderUtil.isText(headers['content-type'])) {
      return this._accumulateResponse(res, requestOptions, resolve, reject);
    }

    if (!this.isIgnoredType(requestOptions.headers.accept)) {
      this.logger.warn('Non Textual Content-Type Detected...Piping Response from Source Server.');
    }
    this._pipeResonse(res, outputBuffer, resolve, reject);
  }
}


HttpClient.prototype._onRequestError = function(requestOptions, resolve, reject) {
  return (error) => {
    let isIgnoredContentType = this.isIgnoredType(requestOptions.headers.accept)
    switch (error.code) {
      case 'ENOTFOUND':
        if (!isIgnoredContentType) {
          this.logger.debug('Unable to Connect to Host.');
          this.logger.debug('Check the Domain Spelling and Try Again.');
          this.logger.debug('No Data Saved for Request.');
        }
        break;
    }

    if (isIgnoredContentType) {
      reject(false);
    } else {
      reject(error);
    }
  }
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
  let isJson = contentType === 'application/json';
  let statusCode = res.statusCode;
  let responseData = '';

  res.on('data', function (chunk) {
    responseData += chunk;
  });

  res.on('end', function() {
    resolve({
      request: options,
      status: statusCode,
      type: contentType || 'text/plain',
      headers: res.headers,
      data: options.method == 'OPTIONS' || !isJson ? responseData : Util.parseJSON(responseData)
    });
  });

  res.on('error', function () {
    reject('Unable to load data from request.');
  });
}

export default HttpClient;
