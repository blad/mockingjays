var expect = require('chai').expect;
var DefaultOptions = require('../src/default_options');


describe('DefaultOptions', function() {

  describe('_handeBaseUrlDefault', function() {
    var defaults = new DefaultOptions(); // Deafaults Object is not stateful.
    var userProvidedInput = {}

    it('should expect a serverBaseUrl value from the user', function() {
      expect(function() { defaults._handleBaseUrlDefault(userProvidedInput)}).to.throw('serverBaseUrl is required! It can not be empty.');
    })
  })


  describe('_handleCacheDirectoryDefault', function() {
    var defaults = new DefaultOptions(); // Deafaults Object is not stateful.
    var userProvidedInput = {}

    it('should expect a default cacheDir value from the user', function() {
      expect(function() { defaults._handleCacheDirectoryDefault(userProvidedInput)}).to.throw('cacheDir is required! It can not be empty.');
    })
  })


  describe('merge()', function() {
    var defaults = new DefaultOptions(); // Deafaults Object is not stateful.

    it('merges successuflly when ALL options are provided', function () {
      var userProvidedOptions = {
        overrideCacheDir: '/var/base/fixtures',
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        port: 9123,
        ignoreContentType: 'image/*,text/html',
        refresh: true,
        passthrough: false,
        logLevel: 'debug',
        cacheHeader: 'authorization,content-length',
        responseHeaderBlacklist: ['date'],
        whiteLabel: true
      };

      var expectedOptionsOutput = {
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
	      ignoreJsonBodyPath: [],
        transitionConfig: {},
        whiteLabel: true
      };
      expect(defaults.merge(userProvidedOptions)).to.deep.equal(expectedOptionsOutput);
    })



    it('merges successuflly when MINIMUM options are provided', function () {
      var userProvidedOptions = {
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
      };

      var expectedOptionsOutput = {
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
        responseHeaderBlacklist: [],
        readOnly: false,
        logLevel: 'info',
        transitionConfig: {},
	      ignoreJsonBodyPath: [],
        whiteLabel: false
      };

      expect(defaults.merge(userProvidedOptions)).to.deep.equal(expectedOptionsOutput);
    })
  })
})
