var FileSystem = require('fs');
var RequestHash = require('./request_hash');

var CacheClient = function(cacheDir) {
  this.cacheDir = cacheDir;
}

CacheClient.prototype.isCached = function (request) {
  var self = this;
  var mode = FileSystem.F_OK | FileSystem.R_OK | FileSystem.W_OK;
  var error;
  try {
    error = FileSystem.accessSync(self.path(request), mode);
    return true;
  } catch (error) {
    return false;
  }
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

CacheClient.prototype.record = function (request, response) {
  var self = this;
  return new Promise(function(resolve, reject) {
    FileSystem.writeFile(self.path(request), response, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

CacheClient.prototype.path = function (request) {
  var requestHash = new RequestHash(request).toString();
  return this.cacheDir + '/' + requestHash;
}

module.exports = CacheClient
