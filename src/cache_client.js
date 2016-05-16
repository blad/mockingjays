var Color = require('./colorize');
var FileSystem = require('fs');
var path = require('path');
var url = require('url')
var FileSystemHelper = require('./filesystem_helper');
var RequestHash = require('./request_hash');
var Util = require('./util');

var CacheClient = function(options) {
  this.logger = options.logger;
  this.cacheDir = options.cacheDir;
  this.cacheHeaders = options.cacheHeaders;
  this.responseHeaderBlacklist = options.responseHeaderBlacklist;
  FileSystemHelper.logger = options.logger;
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
  var filePath = self.path(request);
  self.logger.debug(Color.blue('Serving'), filePath);

  return new Promise(function(resolve, reject) {
    FileSystem.readFile(filePath, function (err, data) {
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
    response.request.headers = HeaderUtil.filterHeaders(self.cacheHeaders, response.request.headers);
    response.headers = HeaderUtil.removeHeaders(self.responseHeaderBlacklist, response.headers);
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


CacheClient.prototype.remove = function (request, originalFilename) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var directory = self.directory(request);
    if (FileSystemHelper.directoryExists(directory)) {
      var filePath = originalFilename ? originalFilename : self.path(request);
      FileSystem.unlink(filePath, function(error) {
        if (error) {
          var message = 'Unable to Delete File: ' + filePath;
          this.logger.error(message, error);
          reject(error)
        } else {
          resolve();
        }
      });
    } else {
      this.logger.info('Path does not exist for request. Skipping action.');
      resolve();
    }
  });
}

CacheClient.prototype.directory = function (request) {
  var requestPath = request.path || '';
  var pathEndsSlash = requestPath.lastIndexOf('/') == path.length - 1
  requestPath = pathEndsSlash ? requestPath.substr(0, requestPath.length - 1) : requestPath;

  return path.join(this.cacheDir, requestPath);
}


CacheClient.prototype.path = function (request) {
  var requestHash = this.requestHash(request);
  var directory = this.directory(request);

  return path.join(directory, requestHash);
}

CacheClient.prototype.requestHash = function (request) {
  return new RequestHash(request, this.cacheHeaders).toString();
}

module.exports = CacheClient
