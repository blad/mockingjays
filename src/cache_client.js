var FileSystem = require('fs');
var url = require('url')
var FileSystemHelper = require('./filesystem_helper');
var RequestHash = require('./request_hash');
var Util = require('./util');

var CacheClient = function(options) {
  this.cacheDir = options.cacheDir;
  this.cacheHeaders = options.cacheHeaders;
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
        resolve(Util.parseJSON(data));
      }
    });
  });
}

CacheClient.prototype.record = function (request, response) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var responseString = Util.stringify(response) + "\n";

    var writeToFile = function() {
      FileSystem.writeFile(self.path(request), responseString, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    };

    var directory = self.directory(request);
    if (!FileSystemHelper.directoryExists(directory)) {
      FileSystemHelper.createDirectory(directory).then(writeToFile);
    } else {
      writeToFile();
    }
  });
}

CacheClient.prototype.directory = function (request) {
  var urlSplit = url.parse(request.url);
  var path = urlSplit.path || ''
  var pathEndsSlash = path.lastIndexOf('/') === path.length - 1
  path = pathEndsSlash ? path.substr(0, path.length - 1) : path;
  return this.cacheDir + path;
}


CacheClient.prototype.path = function (request) {
  var requestHash = new RequestHash(request, this.cacheHeaders).toString();
  var directory = this.directory(request);
  return directory + '/' + requestHash;
}

module.exports = CacheClient
