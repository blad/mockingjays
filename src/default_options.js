var net = require('net');
var FileSystem = require('fs');
var FileSystemHelper = require('./filesystem_helper');
var Logger = require('./logger');
var Util = require('./util');

var logger = new Logger();

var getBooleanValue = function(value, defaultValue) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  // Handle Boolean Values:
  if (value == true || value == false) {
    return value;
  }

  // Handle String Values
  if (typeof value === 'string') {
    var isTrueString = value.toLowerCase() == 'true';
    var isFalseString = value.toLowerCase() == 'false';

    return isTrueString && !isFalseString;
  }

  return defaultValue
};


/**
 * Provides default values and verifies that requied values are set.
 */
var DefaultOptions = function() {}

DefaultOptions.prototype.options = {
  overrideCacheDir: null,
  cacheDir: null,
  port: process.env.MOCKINGJAYS_PORT || 9000,
  serverBaseUrl: null,
  ignoreContentType: '',
  refresh: false,
  cacheHeader: [],
  responseHeaderBlacklist: [],
  logLevel: 'info',
  transitionConfig: {},
  passthrough: false,
  whiteLabel: false,
  ignoreJsonBodyPath: [],
  accessLogFile: null,
  readOnly: false
}


DefaultOptions.prototype.defaultExtras = {
  attemptToCreateCacheDir: true
}


DefaultOptions.prototype.merge = function(options, extraOptions) {
  var extras = extraOptions || this.defaultExtras;
  this._handleAccessLogFile(options);
  this._handlePortDefault(options);
  this._handleRefreshDefault(options);
  this._handleContentTypeDefault(options);
  this._handleBaseCacheDirectoryDefault(options);
  this._handleCacheDirectoryDefault(options, extras);
  this._handleBaseUrlDefault(options);
  this._handleCacheHeaders(options);
  this._handleResponseHeaders(options);
  this._handleLogLevel(options);
  this._handletransitionConfig(options);
  this._handlePassthrough(options);
  this._handleReadOnly(options);
  this._handleWhiteLabel(options);
  this._handleIgnoreJsonBodyPath(options);
  return options;
}


DefaultOptions.prototype._handleAccessLogFile = function (options) {
  var defaults = this.options;
  options.accessLogFile = options.accessLogFile || defaults.accessLogFile;
}


DefaultOptions.prototype._handleRefreshDefault = function (options) {
  options.refresh = getBooleanValue(options.refresh, this.options.refresh)
}


DefaultOptions.prototype._handleReadOnly = function (options) {
  options.readOnly = getBooleanValue(options.readOnly, this.options.readOnly)
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


DefaultOptions.prototype._handleBaseCacheDirectoryDefault  = function (options, extras) {
  var defaults = this.options;
  // Directory where the cache files can be read from:
  options.overrideCacheDir = options.overrideCacheDir || defaults.overrideCacheDir;

  if (!options.overrideCacheDir) {
    return; // No Base Cache Directory Provided
  }

  if (!FileSystemHelper.directoryExists(options.overrideCacheDir)) {
    logger.warn('Base Cache Directory Does not Exists.')
    logger.warn('Attempting to Create: ', options.overrideCacheDir);
    FileSystemHelper
      .createDirectory(options.overrideCacheDir)
      .catch(function() {
        throw Error("Please Use a Writable Location for the Base Cache Directory.");
      });
  }
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
  if (options.cacheHeader && typeof(options.cacheHeader) === 'string') {
    options.cacheHeader = options.cacheHeader.split(',').map(function(header) { return header.toLowerCase() });
  } else {
    options.cacheHeader = options.cacheHeader || defaults.cacheHeader;
  }
}


DefaultOptions.prototype._handleResponseHeaders = function (options) {
  var defaults = this.options;
  if (options.responseHeaderBlacklist && typeof(options.responseHeaderBlacklist) == 'string') {
    options.responseHeaderBlacklist = options.responseHeaderBlacklist.split(',');
  } else {
    options.responseHeaderBlacklist = options.responseHeaderBlacklist || defaults.responseHeaderBlacklist;
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


DefaultOptions.prototype._handlePassthrough = function (options) {
  options.passthrough = getBooleanValue(options.passthrough, this.options.passthrough)
}


DefaultOptions.prototype._handleWhiteLabel = function (options) {
  options.whiteLabel = getBooleanValue(options.whiteLabel, this.options.whiteLabel)
}

DefaultOptions.prototype._handleIgnoreJsonBodyPath = function (options) {
  var defaults = this.options;
  if (options.ignoreJsonBodyPath && typeof(options.ignoreJsonBodyPath) == 'string') {
    options.ignoreJsonBodyPath = options.ignoreJsonBodyPath.split(',');
  } else {
    options.ignoreJsonBodyPath = options.ignoreJsonBodyPath || defaults.ignoreJsonBodyPath;
  }
}

module.exports = DefaultOptions
