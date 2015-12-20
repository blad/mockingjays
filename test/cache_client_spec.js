var expect = require('chai').expect;
var CacheClient = require('../src/cache_client');


describe('CacheClient', function() {
  var userOptions = {
    cacheDir: '/Users/home/fixtures',
    cacheHeaders: []
  };
  var requests = [
    {
      hostname: 'swapi.co',
      path: '/api/',
      port: 80,
      headers: {authorization: 'Bearer 12345'},
      body: {}
    },
    {
      hostname: 'swapi.co',
      path: '/api/people/1/',
      port: 80,
      headers: {authorization: 'Bearer 12345'},
      body: {}
    }
  ]
  var client = new CacheClient(userOptions);

  describe('directory', function() {
    it('should return the complete directory path for a request', function() {
      expect(client.directory(requests[0])).to.equal('/Users/home/fixtures/api')
      expect(client.directory(requests[1])).to.equal('/Users/home/fixtures/api/people/1')
    })
  })

  describe('path', function() {
    it('should return the complete file path for a request', function() {
      expect(client.path(requests[0])).to.equal('/Users/home/fixtures/api/8846cfb1475fa4c43e2886c339b16a842bf1c6c3')
      expect(client.path(requests[1])).to.equal('/Users/home/fixtures/api/people/1/4515f2389c8e553ab5706c6e9c72b34470bdf749')
    })
  })
})
