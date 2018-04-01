import Hapi from 'hapi';
import inert from 'inert';

var TestServer = function(options){
  options = options || {};
  var userHost = options.host || 'localhost';
  var userPort = options.port || 9001;

  this.state = {};
  this.server = new Hapi.server({host: userHost, port: userPort});
  this.server.register(inert);
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
  this.server.stop({}, function() {});

  return this;
};

TestServer.prototype.start = function () {
  var self = this;
  this.server.start((err) => {
    if (err) { throw err; }
  });

  return this;
};

export default TestServer;
