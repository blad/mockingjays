var crypto = require('crypto');
var Util = require('./util');

var RequestHash = function (request, cacheHeaders) {
  this.request = request;
  this.cacheHeaders = cacheHeaders;
};

RequestHash.prototype.toString = function () {
  var request = this._filteredAttributes();
  var shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(request));
  return shasum.digest('hex');
};

RequestHash.prototype._filteredAttributes = function () {
  var filteredAttributes = Util.simpleCopy(this.request);
  var headers = {};
  var key;
  for (var index = 0; index < this.cacheHeaders.length; index++) {
    key = this.cacheHeaders[index];
    if (this.request.headers[key]) {
      headers[key] = this.request.headers[key];
    }
  }
  filteredAttributes.headers = headers;
  return filteredAttributes;
}

module.exports = RequestHash;
