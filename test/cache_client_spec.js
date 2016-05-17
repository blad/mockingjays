var expect = require('chai').expect;
var CacheClient = require('../src/cache_client');


describe('CacheClient', function() {
  var userOptions = {
    cacheDir: '/Users/home/fixtures',
    cacheHeader: ['authorization']
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
      expect(client.path(requests[0])).to.equal('/Users/home/fixtures/api/085f0240e1ea628f1dcddf45eb05039bdbcbb112')
      expect(client.path(requests[1])).to.equal('/Users/home/fixtures/api/people/1/53a5e4d278c369b43fe7c1c1d3e95a9846ff4311')
    })
  })


  describe('requestHash', function() {
    it('should return the correct hash for each request', function() {
      expect(client.requestHash(requests[0])).to.equal('085f0240e1ea628f1dcddf45eb05039bdbcbb112')
      expect(client.requestHash(requests[1])).to.equal('53a5e4d278c369b43fe7c1c1d3e95a9846ff4311')
    })

    it('should return the different hash for identical requests with different headers', function() {
      copyRequest = {
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        headers: {}, // Missing authorization header
        body: {}
      }

      // Same Client considering `authorization` Different Requests
      expect(client.requestHash(requests[0])).to.not.equal(client.requestHash(copyRequest))

      // Differet Client Different Options not considering any headers
      var newClient = new CacheClient({cacheDir: '/Users/home/fixtures'});
      expect(newClient.requestHash(requests[0])).to.equal(newClient.requestHash(copyRequest))

    })
  })
})
