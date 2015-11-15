var FileSystem = require('fs');
var RequestHash = require('./request_hash');

var CacheClient = function(cacheDir) {
  this.cacheDir = cacheDir;
}

CacheClient.prototype.isCached = function (request) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var mode = FileSystem.F_OK | FileSystem.R_OK | FileSystem.W_OK;
    FileSystem.access(self.path(request), mode, function (error) {
      if (error) { // No Access, File Does Not Exist.
        resolve(false);
      } else { // File Exists and is accessable.
        resolve(true);
      }
    });
  });
}

CacheClient.prototype.fetch = function (request) {
  var self = this;
  return new Promise(function(resolve, reject) {
    FileSystem.readFile(self.path(request), function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

CacheClient.prototype.path = function (request) {
  var requestHash = new RequestHash(request).toString();
  return this.cacheDir + '/' + requestHash;
}

module.exports = CacheClient
