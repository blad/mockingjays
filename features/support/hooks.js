import { After, Before } from 'cucumber';
import TestServer from './test_server';

Before('@TestServer', async function () {
  let world = this;
  world.serverState = { count: 0 };
  world.server = await TestServer();

  world.server.addRoute('/routeWith500', 'GET', function () {
    return new Error('Here is an error you expected.');
  });

  world.server.addRoute('/formData', 'POST', function () {
    return { status: 'success' };
  });

  world.server.addRoute('/getCount', 'GET', function () {
    return world.serverState.count;
  });

  world.server.addRoute('/increment', 'GET', function () {
    world.serverState.count = world.serverState.count + 1;
    return 'incremented';
  });

  world.server.addRoute('/jsonRequest', 'POST', function () {
    return { status: 'success' };
  });

  world.server.addRoute('/cacheHeader', 'POST', function () {
    return { status: 'success' };
  });

  world.server.addRoute('/image', 'GET', function (req, h) {
    return h.file(__dirname + '/test.png').type('image/png');
  });

  world.server.start();
});


After('@TestServer', function () {
  let world = this;
  world.serverState.count = 0;
  world.server.stop();
});
