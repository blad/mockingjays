import http from 'http';

export default function listen (options, requestHandler, onReady) {
  var server = require('http-shutdown')(http.createServer(requestHandler));
  server.listen(options.port, (onReady || function() {}));
  return server;
};
