import Hapi from 'hapi';
import inert from 'inert';

var TestServerBuilder = async function(options){
  options = options || {};
  var userHost = options.host || 'localhost';
  var userPort = options.port || 9001;
  var hapiInstance = new Hapi.server({host: userHost, port: userPort});
  await hapiInstance.register(inert);

  return new TestServer(hapiInstance);
};

var TestServer = function(server){
  this.state = {};
  this.server = server;
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

export default TestServerBuilder;
