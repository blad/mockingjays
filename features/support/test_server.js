var Hapi = require('hapi');

var TestServer = function(options){
  options = options || {};
  var userHost = options.host || '0.0.0.0';
  var userPort = options.port || 9001;

  this.state = {};
  this.server = new Hapi.Server();
  this.server.register(require('inert'), function (err){});
  this.server.connection({
    host: userHost,
    port: userPort,
    routes: {cors: true}
  });
};

TestServer.prototype.addRoute = function (path, method, handler) {
  console.log(path, method)
  this.server.route({
      method: method,
      path: path,
      handler: handler,
      config: {
        cors: true
      }
  });

  return this;
};

TestServer.prototype.stop = function () {
  this.server.stop({}, function() {
    console.log('Server stopped');
  });

  return this;
};

TestServer.prototype.start = function () {
  var self = this;
  this.server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', self.server.info.uri);
  });

  return this;
};

module.exports = TestServer
