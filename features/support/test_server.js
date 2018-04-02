import Hapi from 'hapi';
import inert from 'inert';

let TestServerBuilder = async function(options){
  options = options || {};
  let userHost = options.host || 'localhost';
  let userPort = options.port || 9001;
  let hapiInstance = new Hapi.server({host: userHost, port: userPort});
  await hapiInstance.register(inert);

  return new TestServer(hapiInstance);
};

let TestServer = function(server){
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
  let self = this;
  this.server.start((err) => {
    if (err) { throw err; }
  });

  return this;
};

export default TestServerBuilder;
