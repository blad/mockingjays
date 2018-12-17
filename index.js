import Server from './src/server';
import Mockingjay from './src/mockingjay';
import Rehasher from './src/rehasher';
import DefaultOptions from './src/default_options';

let Mockingjays = function () {};

/**
 * Start creates a Mockingjays server and starts proxying
 * or mocking responses based on previous training.
 *
 * @param options - An {Object} with options
 *          :cacheDir - Path to cache storage.
 *          :port - Port that Mockingjays should bind to.
 *          :serverBaseUrl - Base URL for the source server.
 * @param onReady - A {Function} to be called when the proxy is ready. [Optional]
 */
Mockingjays.prototype.start = function (options, onReady) {
  let defaultOptions = new DefaultOptions();
  let finalOptions = defaultOptions.merge(options);
  let mockingjay = new Mockingjay(finalOptions);
  let requestHandler =  function (req, res) {
    mockingjay.onRequest(req, res);
  };
  this.server = Server.listen(finalOptions, requestHandler, onReady);
  return this;
};

/**
 * Stop a an Mockingjays server.
 *
 * @param done - A {Function} to be called when the server has closed. [Optional]
 */
Mockingjays.prototype.stop = function (done) {
  this.server.forceShutdown(done || function () {});
};

/**
 * @deprecated in favor of .stop
 *
 * Stop a an Mockingjays server.
 *
 * @param done - A {Function} to be called when the server has closed. [Optional]
 */
Mockingjays.prototype.close = function (done) {
  this.server.forceShutdown(done || function () {});
};

/**
 * Processes the existing cache with a new set of options.
 *
 * @param options - An {Object} with options
 *          :cacheDir - Path to cache storage.
 *          :port - Port that Mockingjays should bind to.
 *          :serverBaseUrl - Base URL for the source server.
 */
Mockingjays.prototype.rehash = function (options) {
  let defaultOptions = new DefaultOptions();
  let finalOptions = defaultOptions.merge(options, { attemptToCreateCacheDir: false });
  new Rehasher(finalOptions).process();
};

export default Mockingjays;
