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
  baseCacheDir: null,
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
  ignoreJsonBodyPath: []
}

DefaultOptions.prototype.defaultExtras = {
  attemptToCreateCacheDir: true
}

DefaultOptions.prototype.merge = function(options, extraOptions) {
  var extras = extraOptions || this.defaultExtras;
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
  this._handleWhiteLabel(options);
  this._handleIgnoreJsonBodyPath(options);
  return options;
}

DefaultOptions.prototype._handleRefreshDefault = function (options) {
  var defaults = this.options;
  // Handle Boolean Values:
  if (options.refresh == true || options.refresh == false) {
    options.refresh = options.refresh;
  }

  // Handle String Values
  if (options.refresh && options.refresh != true && options.refresh != false) {
    var isTrueString = options.refresh.toLowerCase() == 'true';
    var isFalseString = options.refresh.toLowerCase() == 'false';

    options.refresh = isTrueString && !isFalseString;
  }

  if (options.refresh === undefined) {
    options.refresh = defaults.refresh
  }
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
  options.baseCacheDir = options.baseCacheDir || defaults.baseCacheDir;

  if (!options.baseCacheDir) {
    return; // No Base Cache Directory Provided
  }

  if (!FileSystemHelper.directoryExists(options.baseCacheDir)) {
    logger.warn('Base Cache Directory Does not Exists.')
    logger.warn('Attempting to Create: ', options.baseCacheDir);
    FileSystemHelper
      .createDirectory(options.baseCacheDir)
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
  var defaults = this.options;
  if (typeof(options.passthrough) === 'undefined') {
    options.passthrough = defaults.passthrough;
    return
  }

  if (options.passthrough == true || options.passthrough == false) {
    options.passthrough = options.passthrough;
  }

  if (typeof(options.passthrough) === 'string') {
    var isTrueString = options.passthrough.toLowerCase() == 'true';
    var isFalseString = options.passthrough.toLowerCase() == 'false';

    options.passthrough = isTrueString && !isFalseString;
  }
}


DefaultOptions.prototype._handleWhiteLabel = function (options) {
  var defaults = this.options;
  if (typeof(options.whiteLabel) === 'undefined') {
    options.whiteLabel = defaults.whiteLabel;
    return
  }

  if (options.whiteLabel == true || options.whiteLabel == false) {
    options.whiteLabel = options.whiteLabel;
  }

  if (typeof(options.whiteLabel) === 'string') {
    var isTrueString = options.whiteLabel.toLowerCase() == 'true';
    var isFalseString = options.whiteLabel.toLowerCase() == 'false';

    options.whiteLabel = isTrueString && !isFalseString;
  }
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
