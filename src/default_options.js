import net from 'net';
import FileSystem from 'fs';

import FileSystemHelper from './filesystem_helper';
import Logger from './logger';
import Util from './util';

let logger = new Logger();

let getBooleanValue = function(value, defaultValue) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  // Handle Boolean Values:
  if (value == true || value == false) {
    return value;
  }

  // Handle String Values
  if (typeof value === 'string') {
    let isTrueString = value.toLowerCase() == 'true';
    let isFalseString = value.toLowerCase() == 'false';

    return isTrueString && !isFalseString;
  }

  return defaultValue
};


/**
 * Provides default values and verifies that requied values are set.
 */
let DefaultOptions = function() {}

DefaultOptions.prototype.options = {
  accessLogFile: null,
  cacheDir: null,
  cacheHeader: [],
  ignoreContentType: '',
  ignoreJsonBodyPath: [],
  logLevel: 'info',
  overrideCacheDir: null,
  passthrough: false,
  port: process.env.MOCKINGJAYS_PORT || 9000,
  readOnly: false,
  refresh: false,
  requestResponseLogFile: null,
  responseHeaderBlacklist: [],
  serverBaseUrl: null,
  transitionConfig: {},
  whiteLabel: false
}


DefaultOptions.prototype.defaultExtras = {
  attemptToCreateCacheDir: true
}


DefaultOptions.prototype.merge = function(options, extraOptions) {
  let extras = extraOptions || this.defaultExtras;
  this._handleAccessLogFile(options);
  this._handleBaseCacheDirectoryDefault(options);
  this._handleBaseUrlDefault(options);
  this._handleCacheDirectoryDefault(options, extras);
  this._handleCacheHeaders(options);
  this._handleContentTypeDefault(options);
  this._handleIgnoreJsonBodyPath(options);
  this._handleLogLevel(options);
  this._handlePassthrough(options);
  this._handlePortDefault(options);
  this._handleReadOnly(options);
  this._handleRefreshDefault(options);
  this._handleRequestResponseLogFile(options);
  this._handleResponseHeaders(options);
  this._handleTransitionConfig(options);
  this._handleWhiteLabel(options);
  return options;
}


DefaultOptions.prototype._handleAccessLogFile = function (options) {
  let defaults = this.options;
  options.accessLogFile = options.accessLogFile || defaults.accessLogFile;
}


DefaultOptions.prototype._handleBaseCacheDirectoryDefault  = function (options, extras) {
  let defaults = this.options;
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


DefaultOptions.prototype._handleBaseUrlDefault = function (options) {
  let defaults = this.options;

  // The base URL of the server to proxy requests to.
  options.serverBaseUrl = options.serverBaseUrl || defaults.serverBaseUrl;
  if (!options.serverBaseUrl) {
    throw Error("serverBaseUrl is required! It can not be empty.");
  };
}


DefaultOptions.prototype._handleCacheHeaders = function (options) {
  let defaults = this.options;
  if (options.cacheHeader && typeof(options.cacheHeader) === 'string') {
    options.cacheHeader = options.cacheHeader.split(',').map(function(header) { return header.toLowerCase() });
  } else {
    options.cacheHeader = options.cacheHeader || defaults.cacheHeader;
  }
}


DefaultOptions.prototype._handleCacheDirectoryDefault = function (options, extras) {
  let defaults = this.options;
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


DefaultOptions.prototype._handleContentTypeDefault = function (options) {
  let defaults = this.options;
  let blacklist = (options.ignoreContentType || defaults.ignoreContentType)
    .split(',')
    .filter(function (type) {return type !== ''})
    .map(function (type) {return type.trim();})
    .map(function (type) {return type.replace(/\*/g, '.*')});
  options.ignoreContentType = blacklist;
}


DefaultOptions.prototype._handleIgnoreJsonBodyPath = function (options) {
  let defaults = this.options;
  if (options.ignoreJsonBodyPath && typeof(options.ignoreJsonBodyPath) == 'string') {
    options.ignoreJsonBodyPath = options.ignoreJsonBodyPath.split(',');
  } else {
    options.ignoreJsonBodyPath = options.ignoreJsonBodyPath || defaults.ignoreJsonBodyPath;
  }
}


DefaultOptions.prototype._handleLogLevel = function (options) {
  let defaults = this.options;
  if (!options.logLevel) {
    options.logLevel = defaults.logLevel;
  }
}


DefaultOptions.prototype._handlePassthrough = function (options) {
  options.passthrough = getBooleanValue(options.passthrough, this.options.passthrough)
}


DefaultOptions.prototype._handlePortDefault = function (options) {
  let defaults = this.options;
  options.port = options.port || defaults.port;
}


DefaultOptions.prototype._handleReadOnly = function (options) {
  options.readOnly = getBooleanValue(options.readOnly, this.options.readOnly)
}


DefaultOptions.prototype._handleRefreshDefault = function (options) {
  options.refresh = getBooleanValue(options.refresh, this.options.refresh)
}


DefaultOptions.prototype._handleRequestResponseLogFile = function (options) {
  let defaults = this.options;
  options.requestResponseLogFile = options.requestResponseLogFile || defaults.requestResponseLogFile;
}


DefaultOptions.prototype._handleResponseHeaders = function (options) {
  let defaults = this.options;
  if (options.responseHeaderBlacklist && typeof(options.responseHeaderBlacklist) == 'string') {
    options.responseHeaderBlacklist = options.responseHeaderBlacklist.split(',');
  } else {
    options.responseHeaderBlacklist = options.responseHeaderBlacklist || defaults.responseHeaderBlacklist;
  }
}


DefaultOptions.prototype._handleTransitionConfig = function (options) {
  let defaults = this.options;
  if (!options.transitionConfig) {
    options.transitionConfig = defaults.transitionConfig;
  } else {
    if (typeof(options.transitionConfig) === 'string') {
      options.transitionConfig = Util.parseJSON(FileSystem.readFileSync(options.transitionConfig, {encoding: 'utf-8'}));
    }
  }
}

DefaultOptions.prototype._handleWhiteLabel = function (options) {
  options.whiteLabel = getBooleanValue(options.whiteLabel, this.options.whiteLabel)
}


export default DefaultOptions;
