import { expect } from 'chai';
import Mockingjay from '../src/mockingjay';

describe('Mockingjay', function () {

  describe('simplify', function () {
    let mockingjay = new Mockingjay({ serverBaseUrl: 'http://www.google.com' });

    it('should prepare options for HTTP request', function () {
      let givenRequest = {
        url: '/query',
        method: 'GET',
        body: '',
        headers: { authorization: 'Basic 12334' }
      };

      expect(mockingjay.simplify(givenRequest)).to.deep.equal({
        hostname: 'www.google.com',
        port: 80,
        path: '/query',
        method: 'GET',
        body: '',
        headers: { authorization: 'Basic 12334' },
        transaction: ''
      });
    });
  });
});
