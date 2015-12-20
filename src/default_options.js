var net = require('net');
var FileSystemHelper = require('./filesystem_helper');

/**
 * Provides default values and verifies that requied values are set.
 */
var DefaultOptions = function() {}

DefaultOptions.prototype.options = {
  cacheDir: null,
  port: process.env.MOCKINGJAYS_PORT || 9000,
  serverBaseUrl: null,
  ignoreContentType: '',
  refresh: false,
  cacheHeaders: [],
  responseHeaderBlacklist: []
}

DefaultOptions.prototype.merge = function(options) {
  this._handlePortDefault(options);
  this._handleRefreshDefault(options);
  this._handleContentTypeDefault(options);
  this._handleCacheDirectoryDefault(options);
  this._handleBaseUrlDefault(options);
  this._handleCacheHeaders(options);
  this._handleResponseHeaders(options);
  return options;
}

DefaultOptions.prototype._handleRefreshDefault = function (options) {
  var defaults = this.options;
  var value = options.refresh == 'true';
  options.refresh = value || defaults.refresh;
}

DefaultOptions.prototype._handlePortDefault = function (options) {
  var defaults = this.options;
  options.port = options.port || defaults.port;
}

DefaultOptions.prototype._handleContentTypeDefault = function (options) {
  var defaults = this.options;
  var blacklist = (options.ignoreContentType || defaults.ignoreContentType)
    .split(',')
    .filter(function (type) {return type !== ''})
    .map(function (type) {return type.trim();})
    .map(function (type) {return type.replace(/\*/g, '.*')});
  options.ignoreContentType = blacklist;
}

DefaultOptions.prototype._handleCacheDirectoryDefault = function (options) {
  var defaults = this.options;
  // Directory where the cache files can be read and written to:
  options.cacheDir = options.cacheDir || defaults.cacheDir;
  if (!options.cacheDir) {
    throw Error("cacheDir is required! It can not be empty.");
  }

  if (!FileSystemHelper.directoryExists(options.cacheDir)) {
    console.warn('Cache Directory Does not Exists.')
    console.warn('Attempting to Create: ', options.cacheDir);
    FileSystemHelper
      .createDirectory(options.cacheDir)
      .catch(function() {
        throw Error("Please Use a Writable Location for the Cache Directory.");
      });
  }
}

DefaultOptions.prototype._handleBaseUrlDefault = function (options) {
  var defaults = this.options;

  // The base URL of the server to proxy requests to.
  options.serverBaseUrl = options.serverBaseUrl || defaults.serverBaseUrl;
  if (!options.serverBaseUrl) {
    throw Error("serverBaseUrl is required! It can not be empty.");
  };
}

DefaultOptions.prototype._handleCacheHeaders = function (options) {
  var defaults = this.options;
  if (options.cacheHeaders && typeof(options.cacheHeaders) == 'string') {
    options.cacheHeaders = options.cacheHeaders.split(',');
  } else {
    options.cacheHeaders = defaults.cacheHeaders;
  }
}


DefaultOptions.prototype._handleResponseHeaders = function (options) {
  var defaults = this.options;
  if (options.responseHeaderBlacklist && typeof(options.responseHeaderBlacklist) == 'string') {
    options.responseHeaderBlacklist = options.responseHeaderBlacklist.split(',');
  } else {
    options.responseHeaderBlacklist = defaults.responseHeaderBlacklist;
  }
}

module.exports = DefaultOptions
