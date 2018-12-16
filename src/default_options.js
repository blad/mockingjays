import FileSystem from 'fs';
import R from 'ramda';

import FileSystemHelper from './filesystem_helper';
import Logger from './logger';
import Util from './util';

let logger = new Logger();

let getBooleanValue = function (value, defaultValue) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  // Handle Boolean Values:
  if (value === true || value === false) {
    return value;
  }

  // Handle String Values
  if (typeof value === 'string') {
    let lowerCaseValue = value.toLowerCase();
    return lowerCaseValue === 'true' && lowerCaseValue !== 'false';
  }

  return defaultValue;
};

/**
 * Provides default values and verifies that requied values are set.
 */
let DefaultOptions = function () {
  this.defaults = {
    attemptToCreateCacheDir: true,
    accessLogFile: null,
    cacheDir: null,
    cacheHeader: [],
    ignoreContentType: '',
    ignoreJsonBodyPath: [],
    logLevel: 'info',
    overrideCacheDir: null,
    passthrough: false,
    port: process.env.MOCKINGJAYS_PORT || 9000,
    queryParameterBlacklist: null,
    readOnly: false,
    refresh: false,
    requestResponseLogFile: null,
    responseHeaderBlacklist: [],
    serverBaseUrl: null,
    transitionConfig: {},
    whiteLabel: false
  };
};


DefaultOptions.prototype.merge = function (options, extraOptions) {
  let defaults = [this.defaults];
  return R.compose(
    R.partial(this._handleAccessLogFile, defaults),
    R.partial(this._handleBaseCacheDirectoryDefault, defaults),
    R.partial(this._handleBaseUrlDefault, defaults),
    R.partial(this._handleCacheHeaders, defaults),
    R.partial(this._handleContentTypeDefault, defaults),
    R.partial(this._handleIgnoreJsonBodyPath, defaults),
    R.partial(this._handleWhiteLabel, defaults),
    R.partial(this._handleLogLevel, defaults),
    R.partial(this._handlePassthrough, defaults),
    R.partial(this._handlePortDefault, defaults),
    R.partial(this._handleReadOnly, defaults),
    R.partial(this._handleRefreshDefault, defaults),
    R.partial(this._handleRequestResponseLogFile, defaults),
    R.partial(this._handleResponseHeaders, defaults),
    R.partial(this._handleTransitionConfig, defaults),
    R.partial(this._handleWhiteLabel, defaults),
    R.partial(this._handleCacheDirectoryDefault, defaults),
    R.partial(this._handleQueryStringBlacklist, defaults),
  )(R.merge(options, extraOptions));
};


DefaultOptions.prototype._handleAccessLogFile = function (defaults, options) {
  return R.assoc('accessLogFile', options.accessLogFile || defaults.accessLogFile, options);
};


DefaultOptions.prototype._handleBaseCacheDirectoryDefault  = function (defaults, options) {
  // Directory where the cache files can be read from:
  options = R.assoc(
    'overrideCacheDir',
    options.overrideCacheDir || defaults.overrideCacheDir,
    options
  );

  if (options.overrideCacheDir && !FileSystemHelper.directoryExists(options.overrideCacheDir)) {
    logger.warn('Base Cache Directory Does not Exists.');
    logger.warn('Attempting to Create: ', options.overrideCacheDir);
    FileSystemHelper
      .createDirectory(options.overrideCacheDir)
      .catch(function () {
        throw Error('Please Use a Writable Location for the Base Cache Directory.');
      });
  }

  return options;
};


DefaultOptions.prototype._handleBaseUrlDefault = function (defaults, options) {
  // The base URL of the server to proxy requests to.
  if (!options.serverBaseUrl) {
    throw Error('serverBaseUrl is required! It can not be empty.');
  }
  return options;
};


DefaultOptions.prototype._handleCacheHeaders = function (defaults, options) {
  if (options.cacheHeader && typeof (options.cacheHeader) === 'string') {
    let value = options.cacheHeader.split(',').map(function (header) { return header.toLowerCase(); });
    return R.assoc('cacheHeader', value, options);
  }
  return R.assoc('cacheHeader', options.cacheHeader || defaults.cacheHeader, options);
};


DefaultOptions.prototype._handleCacheDirectoryDefault = function (defaults, options) {
  // Directory where the cache files can be read and written to:
  options = R.assoc('cacheDir', options.cacheDir || defaults.cacheDir, options);
  if (!options.cacheDir) {
    throw Error('cacheDir is required! It can not be empty.');
  }

  if (!FileSystemHelper.directoryExists(options.cacheDir) && options.attemptToCreateCacheDir) {
    logger.warn('Cache Directory Does not Exists.');
    logger.warn('Attempting to Create: ', options.cacheDir);
    FileSystemHelper
      .createDirectory(options.cacheDir)
      .catch(function () {
        throw Error('Please Use a Writable Location for the Cache Directory.');
      });
  }

  return options;
};


DefaultOptions.prototype._handleContentTypeDefault = function (defaults, options) {
  let blacklist = (options.ignoreContentType || defaults.ignoreContentType)
    .split(',')
    .filter(function (type) { return type !== ''; })
    .map(function (type) { return type.trim(); })
    .map(function (type) { return type.replace(/\*/g, '.*'); });

  return R.assoc('ignoreContentType', blacklist, options);
};


DefaultOptions.prototype._handleIgnoreJsonBodyPath = function (defaults, options) {
  if (options.ignoreJsonBodyPath && typeof (options.ignoreJsonBodyPath) == 'string') {
    return R.assoc('ignoreJsonBodyPath', options.ignoreJsonBodyPath.split(','), options);
  }
  return R.assoc('ignoreJsonBodyPath', options.ignoreJsonBodyPath || defaults.ignoreJsonBodyPath, options);
};


DefaultOptions.prototype._handleLogLevel = function (defaults, options) {
  return R.assoc('logLevel', options.logLevel || defaults.logLevel, options);
};


DefaultOptions.prototype._handlePassthrough = function (defaults, options) {
  return R.assoc('passthrough', getBooleanValue(options.passthrough, defaults.passthrough), options);
};


DefaultOptions.prototype._handlePortDefault = function (defaults, options) {
  return R.assoc('port', options.port || defaults.port, options);
};


DefaultOptions.prototype._handleReadOnly = function (defaults, options) {
  return R.assoc('readOnly', getBooleanValue(options.readOnly, defaults.readOnly), options);
};


DefaultOptions.prototype._handleRefreshDefault = function (defaults, options) {
  return R.assoc('refresh', getBooleanValue(options.refresh, defaults.refresh), options);
};


DefaultOptions.prototype._handleRequestResponseLogFile = function (defaults, options) {
  return R.assoc('requestResponseLogFile', options.requestResponseLogFile || defaults.requestResponseLogFile, options);
};


DefaultOptions.prototype._handleResponseHeaders = function (defaults, options) {
  if (options.responseHeaderBlacklist && typeof (options.responseHeaderBlacklist) == 'string') {
    return R.assoc('responseHeaderBlacklist', options.responseHeaderBlacklist.split(','), options);
  }
  return R.assoc('responseHeaderBlacklist', options.responseHeaderBlacklist || defaults.responseHeaderBlacklist, options);
};


DefaultOptions.prototype._handleTransitionConfig = function (defaults, options) {
  if (!options.transitionConfig) {
    return R.assoc('transitionConfig', defaults.transitionConfig, options);
  }

  if (typeof (options.transitionConfig) === 'string') {
    return R.assoc('transitionConfig', Util.parseJSON(FileSystem.readFileSync(options.transitionConfig, { encoding: 'utf-8' })), options);
  }

  return options;
};


DefaultOptions.prototype._handleWhiteLabel = function (defaults, options) {
  return R.assoc('whiteLabel', getBooleanValue(options.whiteLabel, defaults.whiteLabel), options);
};

DefaultOptions.prototype._handleQueryStringBlacklist = function (defaults, options) {
  return R.assoc(
    'queryParameterBlacklist',
    options.queryParameterBlacklist || defaults.queryParameterBlacklist,
    options
  );
};


export default DefaultOptions;
