import http from 'http';
import httpShutdown from 'http-shutdown';

function listen (options, requestHandler, onReady) {
  var server = httpShutdown(http.createServer(requestHandler));
  server.listen(options.port, (onReady || function() {}));
  return server;
};

export default {listen}
