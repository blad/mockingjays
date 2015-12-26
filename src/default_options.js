var net = require('net');
var FileSystem = require('fs');
var FileSystemHelper = require('./filesystem_helper');
var Logger = require('./logger');
var Util = require('./util');

var logger = new Logger();

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
  responseHeaderBlacklist: [],
  logLevel: 'info',
  transitionConfig: {}
}

DefaultOptions.prototype.defaultExtras = {
  attemptToCreateCacheDir: true
}

DefaultOptions.prototype.merge = function(options, extraOptions) {
  var extras = extraOptions || this.defaultExtras;
  this._handlePortDefault(options);
  this._handleRefreshDefault(options);
  this._handleContentTypeDefault(options);
  this._handleCacheDirectoryDefault(options, extras);
  this._handleBaseUrlDefault(options);
  this._handleCacheHeaders(options);
  this._handleResponseHeaders(options);
  this._handleLogLevel(options);
  this._handletransitionConfig(options);
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

DefaultOptions.prototype._handleCacheDirectoryDefault = function (options, extras) {
  var defaults = this.options;
  // Directory where the cache files can be read and written to:
  options.cacheDir = options.cacheDir || defaults.cacheDir;
  if (!options.cacheDir) {
    throw Error("cacheDir is required! It can not be empty.");
  }

  if (!FileSystemHelper.directoryExists(options.cacheDir) && extras.attemptToCreateCacheDir) {
    logger.warn('Cache Directory Does not Exists.')
    logger.warn('Attempting to Create: ', options.cacheDir);
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

DefaultOptions.prototype._handleLogLevel = function (options) {
  var defaults = this.options;
  if (!options.logLevel) {
    options.logLevel = defaults.logLevel;
  }
}

DefaultOptions.prototype._handletransitionConfig = function (options) {
  var defaults = this.options;
  if (!options.transitionConfig) {
    options.transitionConfig = defaults.transitionConfig;
  } else {
    if (typeof(options.transitionConfig) === 'string') {
      options.transitionConfig = Util.parseJSON(FileSystem.readFileSync(options.transitionConfig, {encoding: 'utf-8'}));
    }
  }
}

module.exports = DefaultOptions
