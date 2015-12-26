Server = require('./src/server');
Mockingjay = require('./src/mockingjay');
Rehasher = require('./src/rehasher');
DefaultOptions = require('./src/default_options');

var Mockingjays = function() {}

/**
 * Start creates a Mockingjays Server and starts proxying
 * or mocking responses based on previous training.
 *
 * @param options - An {Object} with options
 *          :cacheDir - Path to cache storage.
 *          :port - Port that Mockingjays should bind to.
 *          :serverBaseUrl - Base URL for the source server.
 */
 Mockingjays.prototype.start = function(options) {
  var defaultOptions = new DefaultOptions();
  var finalOptions = defaultOptions.merge(options);
  var mockingjay = new Mockingjay(finalOptions);
  this.server = Server.listen(finalOptions, function(req, res){ mockingjay.onRequest(req, res)});
  return this;
}

Mockingjays.prototype.close = function() {
  this.server.close();
}

/**
 * Processes the existing cache with a new set of options.
 *
 * @param options - An {Object} with options
 *          :cacheDir - Path to cache storage.
 *          :port - Port that Mockingjays should bind to.
 *          :serverBaseUrl - Base URL for the source server.
 */
Mockingjays.prototype.rehash = function(options) {
  var defaultOptions = new DefaultOptions();
  var finalOptions = defaultOptions.merge(options, {attemptToCreateCacheDir: false});
  new Rehasher(finalOptions).process();
}

module.exports = Mockingjays
