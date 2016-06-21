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
        port: 9123,
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        ignoreContentType: 'image/*,text/html',
        refresh: true,
        passthrough: false,
        logLevel: 'debug',
        cacheHeader: 'authorization,content-length',
        responseHeaderBlacklist: ['date']
      };

      var expectedOptionsOutput = {
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        port: 9123,
        ignoreContentType: ['image/.*','text/html'],
        refresh: true,
        passthrough: false,
        cacheHeader: ['authorization', 'content-length'],
        responseHeaderBlacklist: ['date'],
        logLevel: 'debug',
        transitionConfig: {}
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
        cacheDir: '/var/app/fixtures',
        serverBaseUrl: 'http://swapi.co',
        // Expected Defaults:
        port: 9000,
        ignoreContentType: [],
        refresh: false,
        passthrough: false,
        cacheHeader: [],
        responseHeaderBlacklist: [],
        logLevel: 'info',
        transitionConfig: {}
      };

      expect(defaults.merge(userProvidedOptions)).to.deep.equal(expectedOptionsOutput);
    })
  })
})
