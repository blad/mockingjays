import sinon from 'sinon';
import {expect} from 'chai';
import HttpClient from '../lib/http_client';

describe('HttpClient', function () {

  before(function() {
    this.http_client = new HttpClient({
      logger: sinon.spy(),
      ignoreContentType: ['image/.*']
    })
  });

  describe('isIgnoredType', function() {
    it('should not log for ignored content-types', function() {
      contentType = 'image/*;text/html;'
      expect(this.http_client.isIgnoredType(contentType)).to.be.ok
    });
  });
});
