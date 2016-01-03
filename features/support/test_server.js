var Hapi = require('hapi');

var TestServer = function(options){
  options = options || {};
  var userHost = options.host || 'localhost';
  var userPort = options.port || 9001;

  this.state = {};
  this.server = new Hapi.Server();
  this.server.connection({host: userHost, port: userPort});
};

TestServer.prototype.addRoute = function (path, method, handler) {
  this.server.route({
      method: method,
      path: path,
      handler: handler.bind(this)
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
