var crypto = require('crypto');

var RequestHash = function (request) {
  this.request = request;
};

RequestHash.prototype.toString = function () {
  var attributes = this.request;
  var shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(this.request));
  return shasum.digest('hex');
};

module.exports = RequestHash;
