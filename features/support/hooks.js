import {After, Before} from 'cucumber';
import fs from 'fs';
import TestServer from './test_server';

Before('@TestServer', async function (scenario) {
  var world = this;
  world.serverState = {count: 0};
  world.server = await TestServer();

  world.server.addRoute('/routeWith500', 'GET', function(req, h) {
    return new Error("Here is an error you expected.");
  });

  world.server.addRoute('/formData', 'POST', function(req, h) {
    return {status: 'success'};
  });

  world.server.addRoute('/getCount', 'GET', function(req, h) {
    return world.serverState.count;
  });

  world.server.addRoute('/increment', 'GET', function(req, h) {
    world.serverState.count = world.serverState.count + 1;
    return 'incremented';
  });

  world.server.addRoute('/jsonRequest', 'POST', function(req, h) {
    return {status: 'success'};
  });

  world.server.addRoute('/cacheHeader', 'POST', function(req, h) {
    return {status: 'success'};
  });

  world.server.addRoute('/image', 'GET', function(req, h) {
    h.file(__dirname + '/test.png')
      .type('image/png');
  });

  world.server.start();
});


After('@TestServer', function (scenario) {
  var world = this;
  world.serverState.count = 0;
  world.server.stop();
});