import { expect } from 'chai';
import RequestHash from '../src/request_hash';


describe('RequestHash with Empty Body', function () {
  let exampleRequestA = {
    hostname: 'swapi.co',
    path: '/api/',
    port: 80,
    headers: { 'authorization': '12345', 'content-type': 'application/json' },
    body: ''
  };

  let exampleRequestADomainB = {
    hostname: 'notarealdomain.com',
    path: '/api/',
    port: 8080,
    headers: { 'authorization': '12345', 'content-type': 'application/json' },
    body: ''
  };

  let exampleRequestB = {
    hostname: 'swapi.co',
    path: '/api/people/1/',
    port: 80,
    headers: { 'authorization': '98745', 'content-type': 'application/json' },
    body: ''
  };

  describe('toString()', function () {
    it('should NOT be equal when headers are considered', function () {
      let cacheHeadersAuthorization = ['authorization'];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders: cacheHeadersAuthorization});
      let hashB = new RequestHash({request: exampleRequestB, cacheHeaders: cacheHeadersAuthorization});

      expect(hashA.toString()).to.not.equal(hashB.toString());
    });

    it('should be NOT be equal when headers are not considered', function () {
      let cacheHeaders = [];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders});
      let hashB = new RequestHash({request: exampleRequestB, cacheHeaders});

      expect(hashA.toString()).to.not.equal(hashB.toString());
    });


    it('should hash to a different value with a white label flag', function () {
      let cacheHeaders = [];
      let hashAWhiteLabel = new RequestHash({request: exampleRequestA, cacheHeaders, whiteLabel: true});
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders});
      expect(hashAWhiteLabel.toString()).to.not.equal(hashA.toString());
    });

    it('should hash to the same value with a white label flag', function () {
      let cacheHeaders = [];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders, whiteLabel: true});
      let hashB = new RequestHash({request: exampleRequestADomainB, cacheHeaders, whiteLabel: true});
      expect(hashA.toString()).to.equal(hashB.toString());
    });
  });


  describe('_filteredAttributes()', function () {
    it('should NOT be equal when headers are included', function () {
      let cacheHeadersAuthorization = ['authorization'];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders: cacheHeadersAuthorization});
      let hashB = new RequestHash({request: exampleRequestB, cacheHeaders: cacheHeadersAuthorization});

      expect(hashA._filteredAttributes()).to.not.deep.equal(hashB._filteredAttributes());
    });

    it('should be NOT be equal when headers are excluded', function () {
      let cacheHeaders = [];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders});
      let hashB = new RequestHash({request: exampleRequestB, cacheHeaders});

      expect(hashA._filteredAttributes()).to.not.deep.equal(hashB._filteredAttributes());
    });

    it('should be filter all headers out', function () {
      let cacheHeaders = [];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders});
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: '',
        headers: {}
      });
    });

    it('should be keep defined headers headers', function () {
      let cacheHeaders = ['content-type'];
      let hashA = new RequestHash({request: exampleRequestA, cacheHeaders});
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: '',
        headers: { 'content-type': 'application/json' }
      });
    });

    it('should be keep defined headers headers', function () {
      let exampleRequestJSONBody = {
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        headers: { 'authorization': '98745', 'content-type': 'application/json' },
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

      let hashA = new RequestHash({request: exampleRequestJSONBody, ignoreJsonBodyPath: ['a.b.c']});
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


    it('should be not add a key if not already present', function () {
      let exampleRequestJSONBody = {
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        headers: { 'authorization': '98745', 'content-type': 'application/json' },
        body: {
          a: {
            b: 'Example Value'
          }
        }
      };

      let hashA = new RequestHash({request: exampleRequestJSONBody, ignoreJsonBodyPath: ['a.b.c']});
      expect(hashA._filteredAttributes()).to.deep.equal({
        hostname: 'swapi.co',
        path: '/api/',
        port: 80,
        body: {
          a: {
            b: 'Example Value'
          }
        },
        headers: {},
      });
    });
  });
});
