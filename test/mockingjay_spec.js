var expect = require('chai').expect;
var Mockingjay = require('../src/mockingjay');


describe('Mockingjay', function () {

  describe('simplify', function () {
    var mockingjay = new Mockingjay({serverBaseUrl: 'http://www.google.com'});

    it('should prepare options for HTTP request', function () {
      var givenRequest = {
        url: '/query',
        method: 'GET',
        body: '',
        headers: {authorization: 'Basic 12334'}
      };

      expect(mockingjay.simplify(givenRequest)).to.deep.equal({
        hostname: 'www.google.com',
        port: 80,
        path: '/query',
        method: 'GET',
        body: '',
        headers: {authorization: 'Basic 12334'}
      });
    });
  });
});
