/**
 * Provides default values and verifies that requied values are set.
 */
var DefaultOptions = {}

DefaultOptions.options = {
  cacheDir: null,
  port: process.env.MOCKINGJAYS_PORT || 9000,
  serverBaseUrl: null
}

DefaultOptions.merge = function(options) {
  var defaults = this.options;
  // Directory where the cache files can be read and written to:
  options.cacheDir = options.cacheDir || defaults.cacheDir;

  // The PORT where the server should bind.
  options.port = options.port || defaults.port;

  // The base URL of the server to proxy requests to.
  options.serverBaseUrl = options.serverBaseUrl || defaults.serverBaseUrl;
  if (!options.serverBaseUrl) {
    throw Error("serverBaseUrl is required! It can not be empty.")
  }

  return options
}

module.exports = DefaultOptions
