var TestServer = require('./test_server');

module.exports = function () {
  var self = this;
  self.serverState = {count: 0};

  this.Before('@TestServer', '@TestServer', function (scenario) {
    self.server = new TestServer();

    self.server.addRoute('/aPostEndpoint', 'POST', function(req, res) {
      res('post-request received');
    });

    self.server.addRoute('/getCount', 'GET', function(req, res) {
      res(self.serverState.count);
    });

    self.server.addRoute('/increment', 'GET', function(req, res) {
      self.serverState.count = self.serverState.count + 1;
      res('incremented');
    });

    self.server.addRoute('/image', 'GET', function(req, res) {
      res
        .file(__dirname + '/test.png')
        .type('image/png');
    });

    self.server.start();
  });


  this.After('@TestServer', '@TestServer', function (scenario) {
    self.serverState.count = 0;
    self.server.stop();
  });
};
