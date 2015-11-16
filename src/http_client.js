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
      var responseData = '';
      res.on('data', function (chunk) {
        responseData += chunk;
      });
      res.on('end', function() {
        resolve(responseData);
      });
      res.on('error', function () {
        reject('Unable to load data from request.');
      });
    });
    req.end()
  });
}

module.exports = HttpClient
