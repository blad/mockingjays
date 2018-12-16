import { expect } from 'chai';
import DefaultOptions from '../src/default_options';

let DEFAULTS = {};
describe('DefaultOptions', function () {

  describe('_handeBaseUrlDefault', function () {
    let defaults = new DefaultOptions(); // Deafaults Object is not stateful.
    let userProvidedInput = {};

    it('should expect a serverBaseUrl value from the user', function () {
      expect(function () { defaults._handleBaseUrlDefault(DEFAULTS, userProvidedInput); }).to.throw('serverBaseUrl is required! It can not be empty.');
    });
  });


  describe('_handleCacheDirectoryDefault', function () {
    let defaults = new DefaultOptions(); // Deafaults Object is not stateful.
    let userProvidedInput = {};

    it('should expect a default cacheDir value from the user', function () {
      expect(function () { defaults._handleCacheDirectoryDefault(DEFAULTS, userProvidedInput); }).to.throw('cacheDir is required! It can not be empty.');
    });
  });


  describe('merge()', function () {
    let defaults = new DefaultOptions(); // Deafaults Object is not stateful.

    it('merges successuflly when ALL options are provided', function () {
      let userProvidedOptions = {
        overrideCacheDir: '/var/base/fixtures',
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        port: 9123,
        ignoreContentType: 'image/*,text/html',
        refresh: true,
        passthrough: false,
        logLevel: 'debug',
        cacheHeader: 'authorization,content-length',
        requestResponseLogFile: '/request/response.log',
        responseHeaderBlacklist: ['date'],
        queryParameterBlacklist: 'butt,things',
        whiteLabel: true
      };

      let expectedOptionsOutput = {
        accessLogFile: null,
        overrideCacheDir: '/var/base/fixtures',
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        port: 9123,
        ignoreContentType: ['image/.*','text/html'],
        ignoreJsonBodyPath: [],
        refresh: true,
        passthrough: false,
        cacheHeader: ['authorization', 'content-length'],
        responseHeaderBlacklist: ['date'],
        logLevel: 'debug',
        readOnly: false,
        requestResponseLogFile: '/request/response.log',
        transitionConfig: {},
        queryParameterBlacklist: 'butt,things',
        whiteLabel: true
      };
      expect(defaults.merge(userProvidedOptions)).to.deep.equal(expectedOptionsOutput);
    });



    it('merges successuflly when MINIMUM options are provided', function () {
      let userProvidedOptions = {
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
      };

      let expectedOptionsOutput = {
        // Provided Values
        overrideCacheDir: null,
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        // Expected Defaults:
        accessLogFile: null,
        port: 9000,
        ignoreContentType: [],
        ignoreJsonBodyPath: [],
        refresh: false,
        passthrough: false,
        cacheHeader: [],
        queryParameterBlacklist: null,
        responseHeaderBlacklist: [],
        requestResponseLogFile: null,
        readOnly: false,
        logLevel: 'info',
        transitionConfig: {},
        whiteLabel: false
      };

      expect(defaults.merge(userProvidedOptions)).to.deep.equal(expectedOptionsOutput);
    });
  });
});
