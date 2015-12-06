var expect = require('chai').expect;
var CacheClient = require('../src/cache_client');


describe('CacheClient', function() {
  var userOptions = {
    cacheDir: '/Users/home/fixtures',
    cacheHeaders: []
  };
  var requests = [
    {
      url: 'http://swapi.co/api/',
      headers: {authorization: 'Bearer 12345'},
      body: {}
    },
    {
      url: 'http://swapi.co/api/people/1',
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
      expect(client.path(requests[0])).to.equal('/Users/home/fixtures/api/3385f89ac8994f375b343ee36cab17126bf4179f')
      expect(client.path(requests[1])).to.equal('/Users/home/fixtures/api/people/1/770b063cb919261e5855c66140e2bd3eaed54eff')
    })
  })
})
