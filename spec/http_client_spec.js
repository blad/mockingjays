var expect = require('chai').expect;
var HttpClient = require('../src/http_client');


describe('HTTPClient', function () {

  describe('_prepareOptions', function () {
    var httpClient = new HttpClient();

    it('should prepare options for HTTP request', function () {
      var givenRequest = {
        url: 'http://www.google.com/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      };

      expect(httpClient._prepareOptions(givenRequest)).to.deep.equal({
        hostname: 'www.google.com',
        port: 80,
        path: '/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      });
    });

    it('should prepare options for HTTPS request', function () {
      var givenRequest = {
        url: 'https://www.google.com/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      };

      expect(httpClient._prepareOptions(givenRequest)).to.deep.equal({
        hostname: 'www.google.com',
        port: 443,
        path: '/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      });
    });

    it('should prepare options on a custom post', function () {
      var givenRequest = {
        url: 'https://www.google.com:9000/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      };

      expect(httpClient._prepareOptions(givenRequest)).to.deep.equal({
        hostname: 'www.google.com',
        port: 9000,
        path: '/query',
        method: 'GET',
        headers: {authorization: 'Basic 12334'}
      });
    });
  });
});
