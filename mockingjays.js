Server = require('./src/server');
Mockingjay = require('./src/mockingjay');
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
  var finalOptions = DefaultOptions.merge(options);
  var mockingjay = new Mockingjay();
  Server.listen(finalOptions, function(req, res){ mockingjay.onRequest(req, res)});
}

module.exports = Mockingjays
