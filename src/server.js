var http = require('http');

module.exports = {
  listen: function(options, requestHandler) {
    var server = http.createServer(requestHandler);
    server.listen(options.port);
    return server;
  }
}
