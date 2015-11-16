var url = require('url')
var HttpClient = function() {}

HttpClient.prototype.fetch = function (requestOptions) {
  var self = this;
  var urlSplit = url.parse(requestOptions.url);
  var isHttps = urlSplit.protocol === 'https:'
  var http = require(isHttps ? 'https' : 'http');
  var options = {
    hostname: urlSplit.hostname,
    port: urlSplit.port || (isHttps ? 443 : 80),
    path: urlSplit.path,
    method: requestOptions.method,
    headers: requestOptions.headers
  };

  return new Promise(function(resolve, reject) {
    var req = http.request(options, function(res) {
      var statusCode = res.statusCode;
      var contentType = res.headers['content-type'];
      var responseData = '';
      res.on('data', function (chunk) {
        responseData += chunk;
      });
      res.on('end', function() {
        resolve({status: statusCode, type: contentType, data: responseData});
      });
      res.on('error', function () {
        reject('Unable to load data from request.');
      });
    });
    if (requestOptions.body) {
      req.write(requestOptions.body);
    }
    req.end()
  });
}

module.exports = HttpClient
