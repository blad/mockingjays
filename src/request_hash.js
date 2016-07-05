var crypto = require('crypto');
var Util = require('./util');
var HeaderUtil = require('./header_util');

var RequestHash = function (request, cacheHeaders, whiteLabel) {
  this.request = request;
  this.cacheHeaders = cacheHeaders;
  this.whiteLabel = whiteLabel;
};


RequestHash.prototype.toString = function () {
  var request = this._filteredAttributes();
  var shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(Util.sortObjectKeys(request)));
  return shasum.digest('hex');
};


RequestHash.prototype._filteredAttributes = function () {
  var filteredAttributes = Util.simpleCopy(this.request);
  filteredAttributes.headers = HeaderUtil.filterHeaders(this.cacheHeaders, this.request.headers);
  if (this.whiteLabel) {
    filteredAttributes.hostname = 'example.com';
    filteredAttributes.port = 80;
  }
  return filteredAttributes;
}

module.exports = RequestHash;
