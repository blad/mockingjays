import {expect} from 'chai';
import HeaderUtil from '../lib/header_util';

describe('Header Util', function () {

  describe('isText', function () {

    it('should return true for textual content types', function () {
      var trueExamples = HeaderUtil.KNOWN_TEXTUAL_CONTENT_TYPES;
      trueExamples.forEach(function (example) {
        expect(HeaderUtil.isText(example)).to.be.true;
      });
    });

    it('should return false for unknown content types', function () {
      var trueExamples = [
        'image/png',
        'image/jpg',
        'application/pdf'
      ];

      trueExamples.forEach(function (example) {
        expect(HeaderUtil.isText(example)).to.be.false;
      });
    });
  });


  describe('filterHeaders', function () {
    var exampleHeaders = {
      'content-type': 'application/json',
      'authorization': 'Basic 123456',
      'content-length': '123'
    }

    it('should remove filters NOT in the wanted list', function() {
      var headersToKeep = ['content-type', 'authorization'];
      var actual = HeaderUtil.filterHeaders(headersToKeep, exampleHeaders);

      expect(actual).to.deep.equal({
        'content-type': 'application/json',
        'authorization': 'Basic 123456'
      });
    });


    it('should remove filters NOT in the wanted list', function() {
      var headersToKeep = ['content-type'];
      var actual = HeaderUtil.filterHeaders(headersToKeep, exampleHeaders);
      expect(actual).to.deep.equal({
        'content-type': 'application/json'
      });
    });


    it('should remove all filters when headers to keep is empty', function() {
      expect(HeaderUtil.filterHeaders([], exampleHeaders)).to.deep.equal({});
      expect(HeaderUtil.filterHeaders(null, exampleHeaders)).to.deep.equal({});
    });
  });


  describe('removeHeaders', function () {
    var exampleHeaders = {
      'content-type': 'application/json',
      'authorization': 'Basic 123456',
      'content-length': '123'
    }

    it('should remove headers in the remove list', function() {
      var headersToRemove = ['content-type', 'authorization'];
      var actual = HeaderUtil.removeHeaders(headersToRemove, exampleHeaders);
      expect(actual).to.deep.equal({
        'content-length': '123'
      });
    });


    it('should remove header in the wanted list', function() {
      var headersToRemove = ['content-type'];
      var actual = HeaderUtil.removeHeaders(headersToRemove, exampleHeaders);
      expect(actual).to.deep.equal({
        'content-length': '123',
        'authorization': 'Basic 123456'
      });
    });


    it('should remove no headers when headers to remove is empty', function() {
      expect(HeaderUtil.removeHeaders([], exampleHeaders)).to.deep.equal(exampleHeaders);
      expect(HeaderUtil.removeHeaders(null, exampleHeaders)).to.deep.equal(exampleHeaders);
    });
  });

  describe('sortHeaders', function () {
    it('should remove filters NOT in the wanted list', function() {
      var actual = HeaderUtil.sortHeaders({
        'zyx': '789',
        'def': '456',
        'ghi': '753',
        'abc': '123'
      });
      var expectedOrder = ['abc', 'def', 'ghi', 'zyx']
      var index = 0;
      for (var key in actual) {
        expect(key).to.deep.equal(expectedOrder[index]);
        index++;
      }
    });
  });


  describe('standardize', function () {
    it('should remove headers not part of the whitelist', function() {
      var actual = HeaderUtil.standardize({'zyx': '789', 'def': '456',});
      expect(actual).to.deep.equal({});
    });

    it('should keep headers part of the whitelist', function() {
      var exampleHeaders = {
        'authorization': 'Basic 12345',
        'content-length': '123',
        'content-type': 'application/json',
        'origin': '*',
        'access-control-request-method': '*',
        'access-control-request-headers': '*'
      }

      var actual = HeaderUtil.standardize(exampleHeaders);
      expect(actual).to.deep.equal(exampleHeaders);
    });


    it('should remove content-legth when it is zero', function() {
      var exampleHeaders = {'content-length': '0', 'authorization': 'Basic 12345'};
      var actual = HeaderUtil.standardize(exampleHeaders);
      expect(actual).to.deep.equal({'authorization': 'Basic 12345'});
    });

    it('should remove headers NOT in whitelist', function() {
      var exampleHeaders = {
        'authorization': 'Basic 12345',
        'cookie': 'abc=123;',
        'date': 'Today',
        'pragma': 'pragma-value'
      };
      var actual = HeaderUtil.standardize(exampleHeaders);
      expect(actual).to.deep.equal({'authorization': 'Basic 12345'});
    });
  });


  describe('getCorsHeaders', function () {
    it('should return an object of headers', function() {
      var actual = HeaderUtil.getCorsHeaders();
      expect(actual).to.be.ok;
      expect(actual).to.deep.equal({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With,Content-Type,Accept,Origin,Authorization",
        "Access-Control-Allow-Methods": "HEAD,OPTIONS,GET,PUT,POST,DELETE",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Max-Age": "1800"
      });
    });


    it('should return an object with the origin of the request', function() {
      var origin = 'http://example.com'
      var actual = HeaderUtil.getCorsHeaders(origin);
      expect(actual).to.be.ok;
      expect(actual).to.deep.equal({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "X-Requested-With,Content-Type,Accept,Origin,Authorization",
        "Access-Control-Allow-Methods": "HEAD,OPTIONS,GET,PUT,POST,DELETE",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Max-Age": "1800"
      });
    });
  });
});
