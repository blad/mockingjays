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
      expect(client.directory(requests[0])).to.equal('/Users/home/fixtures/api/')
      expect(client.directory(requests[1])).to.equal('/Users/home/fixtures/api/people/1/')
    })
  })

  describe('path', function() {
    it('should return the complete file path for a request', function() {
      expect(client.path(requests[0])).to.equal('/Users/home/fixtures/api/6ecbc953b1c177653aa5223b39af99d2381c9136')
      expect(client.path(requests[1])).to.equal('/Users/home/fixtures/api/people/1/5496e5424f8dbd30a96c9da868ba46669388da4b')
    })
  })
})
