/**
 * Core that determines wether to fetch a fresh copy from the source or
 * fetch a cached copy of the data.
 */

var CacheClient = require('./cache_client');
var HttpClient = require('./http_client');

var Mockingjay = function(options) {
  this.options = options;
  this.cacheClient = new CacheClient(this.options.cacheDir);
  this.httpClient = new HttpClient();
}

/**
 * Determine if we have request cached.
 */
Mockingjay.prototype.knows = function(request) {
  return this.cacheClient.isCached(request);
};

/**
 * Fetch a Request form cache.
 */
Mockingjay.prototype.repeat = function(request) {
  console.log('Mockingjay Repeating: ' + JSON.stringify(request));
  return this.cacheClient.fetch(request);
};

/**
 * Fetch a Request form the Source.
 */
Mockingjay.prototype.learn = function(request) {
  console.log('Mockingjay Learning: ' + JSON.stringify(request));
  var self = this;
  var responsePromise = this.httpClient.fetch(request);
  return responsePromise.then(function(response) {
    return self.cacheClient.record(request, response);
  });
};

/**
 * Function that echos the response back to the client.
 * Within this function we determine if we need to learn
 * or need to fetch a fresh response.
 */
Mockingjay.prototype.echo = function(request, outputBuffer) {
  console.log('Mockingjay echoing response for requests: ' + JSON.stringify(request));
  var responsePromise = this.knows(request) ? this.repeat(request) : this.learn(request);
  responsePromise.then(function(response) {
    // outputBuffer.writeHead(200, {"Content-Type": "text/plain"});
    outputBuffer.write(response);
    outputBuffer.end();
  });
};

/**
 * Callback that is called when the server recieves a request.
 */
Mockingjay.prototype.onRequest = function(request, response) {
  var self = this;
  var simplifiedResponse = this.simplify(request);
  request.on('data', function(data) {
    request.body += data;
  });

  request.on('end', function() {
    self.echo(simplifiedResponse, response);
  });
};


Mockingjay.prototype.simplify = function (req) {
  delete req.headers.host
  return {
    url: this.options.serverBaseUrl + req.url,
    body: '',
    headers: req.headers,
    method: req.method
  }
};

module.exports = Mockingjay
