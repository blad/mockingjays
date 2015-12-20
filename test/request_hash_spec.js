var expect = require('chai').expect;
var RequestHash = require('../src/request_hash');


describe('RequestHash with Empty Body', function() {
  var exampleRequestA = {
    url: 'http://swapi.co/api/',
    headers: {'authorization': '12345', 'content-type': 'application/json'},
    body: ''
  }

  var exampleRequestB = {
    url: 'http://swapi.co/api/people1',
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
      expect(hashA._filteredAttributes()).to.deep.equal({url: 'http://swapi.co/api/', body: '', headers: {}});
    });

    it('should be keep defined headers headers', function () {
      var cacheHeaders = ['content-type']
      var hashA = new RequestHash(exampleRequestA, cacheHeaders);
      expect(hashA._filteredAttributes()).to.deep.equal({url: 'http://swapi.co/api/', body: '', headers: {'content-type': 'application/json'}});
    });
  });
});
