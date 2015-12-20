var url = require('url')
var HeaderUtil = require('./header_util');
var Util = require('./util');

var HttpClient = function() {}

HttpClient.prototype.fetch = function (requestOptions, outputBuffer) {
  var self = this;
  var http = require(requestOptions.port == 443 ? 'https' : 'http');

  return new Promise(function(resolve, reject) {
    var req = http.request(requestOptions, function(res) {
      var statusCode = res.statusCode;
      if (HeaderUtil.isText(res.headers['content-type'])) {
        self._accumulateResponse(res, requestOptions, resolve, reject);
      } else {
        console.log('Non Textual Content-Type Detected...Piping Response from Source Server.');
        self._pipeResonse(res, outputBuffer, resolve, reject);
      }
    });

    if (requestOptions.body) {
      req.write(requestOptions.body);
    }
    req.end()
  });
}


HttpClient.prototype._pipeResonse = function (res, outputBuffer, resolve, reject) {
  var contentType = res.headers['content-type'];
  var statusCode = res.statusCode
  res.pipe(outputBuffer);

  resolve({
    status: statusCode,
    type: contentType,
    piped: true
  });
}


HttpClient.prototype._accumulateResponse = function (res, options, resolve, reject) {
  var contentType = res.headers['content-type'];
  var statusCode = res.statusCode;
  var responseData = '';
  res.on('data', function (chunk) {
    responseData += chunk;
  });

  res.on('end', function() {
    var isJson = contentType === 'application/json'
    resolve({
      request: options,
      status: statusCode,
      type: contentType,
      headers: res.headers,
      data: options.method == 'OPTIONS' ? responseData : (isJson ? Util.parseJSON(responseData) : responseData)
    });
  });

  res.on('error', function () {
    reject('Unable to load data from request.');
  });
}

module.exports = HttpClient
