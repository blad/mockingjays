import {expect} from 'chai';
import path from 'path';
import CacheClient from '../src/cache_client';

describe('CacheClient', () => {
  context('simple options', () => {
    beforeEach(function() {
      let userOptions = {
        cacheDir: '/Users/home/fixtures',
        cacheHeader: ['authorization']
      };
      this.requests = [
        // Has a single word resource
        {
          hostname: 'swapi.co',
          path: '/api/',
          port: 80,
          headers: {authorization: 'Bearer 12345'},
          body: {}
        },
        // Has a multiple word and / separated resource
        {
          hostname: 'swapi.co',
          path: '/api/people/1/',
          port: 80,
          headers: {authorization: 'Bearer 12345'},
          body: {}
        },
        // has query param on directory
        {
          hostname: 'swapi.co',
          path: '/api/people/1/?abc=123&other-illegal=<>:"\|?*',
          port: 80,
          headers: {authorization: 'Bearer 12345'},
          body: {}
        },
        // Has query params on last item
        {
          hostname: 'swapi.co',
          path: '/api/people/1/test?abc=123&other-illegal=<>:"\|?*',
          port: 80,
          headers: {authorization: 'Bearer 12345'},
          body: {}
        },
        // Has Caps in the URL
        {
          hostname: 'swapi.co',
          path: '/api/CAPS/PEOPLE/1/test?abc=123&other-illegal=<>:"\|?*',
          port: 80,
          headers: {authorization: 'Bearer 12345'},
          body: {}
        }
      ]
      this.client = new CacheClient(userOptions);
    });

    describe('directory', () => {
      it('should return the complete directory path for a request', function() {
        expect(this.client.directory(this.requests[0], '/Users/home/fixtures')).to.equal('/Users/home/fixtures/api/');
        expect(this.client.directory(this.requests[1], '/Users/home/fixtures')).to.equal('/Users/home/fixtures/api/people/1/');
        expect(this.client.directory(this.requests[2], '/Users/home/fixtures')).to.equal('/Users/home/fixtures/api/people/1/');
        expect(this.client.directory(this.requests[3], '/Users/home/fixtures')).to.equal('/Users/home/fixtures/api/people/1/test');
        expect(this.client.directory(this.requests[4], '/Users/home/fixtures')).to.equal('/Users/home/fixtures/api/caps/people/1/test');
      })
    });


    describe('fetch', () => {
      it('should resolve to the file contents', function() {
        let temp = this.client.requestPath;
        this.client.logger = {debug: () => {}}
        this.client.requestPath = () => path.dirname(__filename) + '/fixture/sample.json'

        return this.client.fetch('some-request-object').then((data) => {
          expect(data).to.deep.equal({test: 'passing'})
          this.client.requestPath = temp;
        });
      })
    });


    describe('isCached', () => {
      it('should return false for files that do not exist', function() {
        let temp = this.client.requestPath;
        this.client.requestPath = () => __filename + '.404'; // stub of file path we know exists does Not exist

        expect(this.client.isCached(this.requests[0])).to.be.false;

        this.client.requestPath = temp; // Restore original method
      });

      it('should return true for files that do exist', function() {
        let temp = this.client.requestPath;
        this.client.requestPath = () => __filename; // stub of file path we know exists

        expect(this.client.isCached(this.requests[1])).to.be.true

        this.client.requestPath = temp; // Restore original method
      });
    });


    describe('requestPath', () => {
      it('should return the complete file path for a request', function() {
        expect(this.client.requestPath(this.requests[0])).to.equal('/Users/home/fixtures/api/5abade6469.json');
        expect(this.client.requestPath(this.requests[1])).to.equal('/Users/home/fixtures/api/people/1/d11fcbc62f.json');
        expect(this.client.requestPath(this.requests[2])).to.equal('/Users/home/fixtures/api/people/1/5dfce70c03.json');
        expect(this.client.requestPath(this.requests[3])).to.equal('/Users/home/fixtures/api/people/1/test/08e804a632.json');
      })
    });


    describe('requestHash', () => {
      it('should return the correct hash for each request', function() {
        expect(this.client.requestHash(this.requests[0])).to.equal('5abade6469');
        expect(this.client.requestHash(this.requests[1])).to.equal('d11fcbc62f');
      })

      it('should return the different hash for identical requests with different headers', function() {
        let copyRequest = {
          hostname: 'swapi.co',
          path: '/api/',
          port: 80,
          headers: {}, // Missing authorization header
          body: {}
        }

        // Same Client considering `authorization` Different Requests
        expect(this.client.requestHash(this.requests[0])).to.not.equal(this.client.requestHash(copyRequest))

        // Differet Client Different Options not considering any headers
        let newClient = new CacheClient({cacheDir: '/Users/home/fixtures'});
        expect(newClient.requestHash(this.requests[0])).to.equal(newClient.requestHash(copyRequest))

      });
    });
  });

  context('with override cache dir options', () => {
    beforeEach(function() {
      this.client = new CacheClient({
        overrideCacheDir: '/Users/home/fixtures/override',
        cacheDir: '/Users/home/fixtures',
        cacheHeader: ['authorization']
      });

      this.request = {
          hostname: 'swapi.co',
          path: '/api/',
          port: 80,
          headers: {},
          body: {}
        }
    });

    describe('getWriteFileName', () => {
      beforeEach(function() {
        this.result = this.client.getWriteFileName(this.request)
      });
      it('should return the override path when override path is provided', function() {
        expect(this.result).to.equal('/Users/home/fixtures/override/api/0bfd6ce9f4.json')
      })
    });

    describe('getReadFileName', () => {
      context('when no override cachedir is set', () => {
        beforeEach(function() {
          this.client.overrideCacheDir = null;
          this.result = this.client.getReadFileName(this.request);
        })

        it('should return the override path when override path is provided', function() {
          expect(this.result).to.equal('/Users/home/fixtures/api/0bfd6ce9f4.json')
        })
      });


      context('when an override cachedir is set, but file does not exist', () => {
        beforeEach(function() {
          this.result = this.client.getReadFileName(this.request);
        });

        it('should return the override path when override path is provided', function() {
          expect(this.result).to.equal('/Users/home/fixtures/api/0bfd6ce9f4.json')
        })
      });

      context('when an override cachedir is set, and file *does* exist', () => {
        beforeEach(function() {
          this.client = new CacheClient({
              overrideCacheDir: '/Users/home/fixtures/override',
              cacheDir: '/Users/home/fixtures',
              cacheHeader: ['authorization']
            });
          this.client.isInOverrideCache = () => console.log('stub') || true
          this.result = this.client.getReadFileName(this.request);
        });

        it('should return the override path when override path is provided', function() {
          expect(this.result).to.equal('/Users/home/fixtures/override/api/0bfd6ce9f4.json')
        })
      });
    });
  });
})
