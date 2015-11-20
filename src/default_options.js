var FileSystemHelper = require('./filesystem_helper');

/**
 * Provides default values and verifies that requied values are set.
 */
var DefaultOptions = function() {}

DefaultOptions.prototype.options = {
  cacheDir: null,
  port: process.env.MOCKINGJAYS_PORT || 9000,
  serverBaseUrl: null
}

DefaultOptions.prototype.merge = function(options) {
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


  // The PORT where the server should bind.
  options.port = options.port || defaults.port;

  // The base URL of the server to proxy requests to.
  options.serverBaseUrl = options.serverBaseUrl || defaults.serverBaseUrl;
  if (!options.serverBaseUrl) {
    throw Error("serverBaseUrl is required! It can not be empty.");
  }

  return options
}

module.exports = DefaultOptions
