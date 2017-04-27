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
    },
    {
      hostname: 'swapi.co',
      path: '/api/people/1/?abc=123&other-illegal=<>:"\|?*',
      port: 80,
      headers: {authorization: 'Bearer 12345'},
      body: {}
    },
    {
      hostname: 'swapi.co',
      path: '/api/people/1/test?abc=123&other-illegal=<>:"\|?*',
      port: 80,
      headers: {authorization: 'Bearer 12345'},
      body: {}
    }
  ]
  var client = new CacheClient(userOptions);

  describe('directory', function() {
    it('should return the complete directory path for a request', function() {
      expect(client.directory(requests[0])).to.equal('/Users/home/fixtures/api/');
      expect(client.directory(requests[1])).to.equal('/Users/home/fixtures/api/people/1/');
      expect(client.directory(requests[2])).to.equal('/Users/home/fixtures/api/people/1/');
      expect(client.directory(requests[3])).to.equal('/Users/home/fixtures/api/people/1/test');
    })
  });


  describe('isCached', function() {
    it('should return false for files that do not exist', function() {
      temp = client.requestPath;
      client.requestPath = () => __filename + '.404'; // stub of file path we know exists does Not exist

      expect(client.isCached(requests[0])).to.be.false;

      client.requestPath = temp; // Restore original method
    });

    it('should return true for files that do exist', function() {
      temp = client.requestPath;
      client.requestPath = () => __filename; // stub of file path we know exists

      expect(client.isCached(requests[1])).to.be.true

      client.requestPath = temp; // Restore original method
    });
  });


  describe('path', function() {
    it('should return the complete file path for a request', function() {
      expect(client.requestPath(requests[0])).to.equal('/Users/home/fixtures/api/085f0240e1.json');
      expect(client.requestPath(requests[1])).to.equal('/Users/home/fixtures/api/people/1/53a5e4d278.json');
      expect(client.requestPath(requests[2])).to.equal('/Users/home/fixtures/api/people/1/f9e15eed28.json');
      expect(client.requestPath(requests[3])).to.equal('/Users/home/fixtures/api/people/1/test/0b0728a0a1.json');
    })
  });


  describe('requestHash', function() {
    it('should return the correct hash for each request', function() {
      expect(client.requestHash(requests[0])).to.equal('085f0240e1');
      expect(client.requestHash(requests[1])).to.equal('53a5e4d278');
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

    });
  });
})
