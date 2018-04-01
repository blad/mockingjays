import {After, Before} from 'cucumber';
import fs from 'fs';
import TestServer from './test_server';

Before('@TestServer', function (scenario) {
  var world = this;
  world.serverState = {count: 0};
  world.server = new TestServer();

  world.server.addRoute('/routeWith500', 'GET', function(req, res) {
      res(new Error("Here is an error you expected."))
  });

  world.server.addRoute('/getCount', 'GET', function(req, res) {
    res(world.serverState.count);
  });

  world.server.addRoute('/increment', 'GET', function(req, res) {
    world.serverState.count = world.serverState.count + 1;
    res('incremented');
  });

  world.server.addRoute('/jsonRequest', 'POST', function(req, res) {
    res({status: 'success'});
  });

  world.server.addRoute('/cacheHeader', 'POST', function(req, res) {
    res({status: 'success'});
  });

  world.server.addRoute('/image', 'GET', function(req, res) {
    res
      .file(__dirname + '/test.png')
      .type('image/png');
  });

  world.server.start();
});


After('@TestServer', function (scenario) {
  var world = this;
  world.serverState.count = 0;
  world.server.stop();
});