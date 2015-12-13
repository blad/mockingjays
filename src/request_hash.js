var crypto = require('crypto');
var Util = require('./util');
var HeaderUtil = require('./header_util');

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
  filteredAttributes.headers = HeaderUtil.filterHeaders(this.cacheHeaders, this.request.headers);
  return filteredAttributes;
}

module.exports = RequestHash;
