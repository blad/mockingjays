var http = require('http');

module.exports = {
  listen: function(options, requestHandler, onReady) {
    var server = require('http-shutdown')(http.createServer(requestHandler));
    server.listen(options.port, (onReady || function() {}));
    return server;
  }
}
