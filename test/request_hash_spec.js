var expect = require('chai').expect;
var RequestHash = require('../src/request_hash');


describe('RequestHash with Empty Body', function() {
  var exampleRequestA = {
    hostname: 'swapi.co',
    path: '/api/',
    port: 80,
    headers: {'authorization': '12345', 'content-type': 'application/json'},
    body: ''
  }

  var exampleRequestADomainB = {
    hostname: 'notarealdomain.com',
    path: '/api/',
    port: 8080,
    headers: {'authorization': '12345', 'content-type': 'application/json'},
    body: ''
  }

  var exampleRequestB = {
    hostname: 'swapi.co',
    path: '/api/people/1/',
    port: 80,
    headers: {'authorization': '98745', 'content-type': 'application/json'},
    body: ''
  }

  describe('toString()', function() {
    it('should NOT be equal when headers are considered', function () {
      var cacheHeadersAuthorization = ['authorization']
      var hashA = new RequestHash(exampleRequestA, cacheHeadersAuthorization);
      var hashB = new RequestHash(exampleRequestB, cacheHeadersAuthorization);

      expect(hashA.toString()).to.not.equal(hashB.toString());
    });

    it('should be NOT be equal when headers are not considered', function () {
      var cacheHeaders = []
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      var hashB = new RequestHash(exampleRequestB, cacheHeaders);

      expect(hashA.toString()).to.not.equal(hashB.toString());
    });


    it('should hash to a different value with a white label flag', function () {
      var cacheHeaders = []
      var hashAWhiteLabel = new RequestHash(exampleRequestA, cacheHeaders, true);
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      expect(hashAWhiteLabel.toString()).to.not.equal(hashA.toString());
    });

    it('should hash to the same value with a white label flag', function () {
      var cacheHeaders = []
      var hashA = new RequestHash(exampleRequestA, cacheHeaders, true);
      var hashB = new RequestHash(exampleRequestADomainB, cacheHeaders, true);
      expect(hashA.toString()).to.equal(hashB.toString());
    });
  });


  describe('_filteredAttributes()', function() {
    it('should NOT be equal when headers are included', function () {
      var cacheHeadersAuthorization = ['authorization']
      var hashA = new RequestHash(exampleRequestA, cacheHeadersAuthorization);
      var hashB = new RequestHash(exampleRequestB, cacheHeadersAuthorization);

      expect(hashA._filteredAttributes()).to.not.deep.equal(hashB._filteredAttributes());
    });

    it('should be NOT be equal when headers are excluded', function () {
      var cacheHeaders = []
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      var hashB = new RequestHash(exampleRequestB, cacheHeaders);

      expect(hashA._filteredAttributes()).to.not.deep.equal(hashB._filteredAttributes());
    });

    it('should be filter all headers out', function () {
      var cacheHeaders = []
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: '',
        headers: {}
      });
    });

    it('should be keep defined headers headers', function () {
      var cacheHeaders = ['content-type']
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: '',
        headers: {'content-type': 'application/json'}
      });
    });

    it('should be keep defined headers headers', function () {
      var exampleRequestJSONBody = {
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        headers: {'authorization': '98745', 'content-type': 'application/json'},
        body: {
          a: {
            b: {
              c: 'hide-me'
            },
            d: 'keep-me'
          },
          e: 'another-keeper'
        }
      };

      var hashA = new RequestHash(exampleRequestJSONBody, null, null, ['a.b.c']);
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: {
          a: {
            b: {
              c: '---omitted-by-proxy---'
            },
            d: 'keep-me'
          },
          e: 'another-keeper'
        },
        headers: {},
      });
    });
  });
});
