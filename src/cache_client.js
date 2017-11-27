var Color = require('./colorize');
var fs = require('fs');
var path = require('path');
var url = require('url')
var FileSystemHelper = require('./filesystem_helper');
var RequestHash = require('./request_hash');
var Util = require('./util');

const RW_MODE = fs.F_OK | fs.R_OK | fs.W_OK;
const EXT = '.json';

let replaceQueryParam = function(directoryName) {
  var queryParamStartIndex = directoryName.indexOf('?');

  if (queryParamStartIndex == -1){
    return directoryName;
  }

  return directoryName.substr(0, queryParamStartIndex);
}

var CacheClient = function(options) {
  this.logger = options.logger;
  this.passthrough = options.passthrough;
  this.cacheDir = options.cacheDir;
  this.cacheHeader = options.cacheHeader;
  this.responseHeaderBlacklist = options.responseHeaderBlacklist;
  this.whiteLabel = options.whiteLabel;
  this.ignoreJsonBodyPath = options.ignoreJsonBodyPath;
  this.overrideCacheDir = options.overrideCacheDir;
  this.accessLogFile = options.accessLogFile;
  FileSystemHelper.logger = options.logger;
}


CacheClient.prototype.isCached = function (request) {
  if (this.passthrough) {return false;}
  return this.isInOverrideCache(request) || this.isInCached(request);
}


CacheClient.prototype.isInOverrideCache = function (request) {
  if (!this.overrideCacheDir) {
    return false;
  }

  try {
    fs.accessSync(this.requestPathOverride(request), RW_MODE);
    return true;
  } catch (error) {
    return false;
  }
}


CacheClient.prototype.isInCached = function (request) {
  try {
    fs.accessSync(this.requestPath(request), RW_MODE);
    return true;
  } catch (error) {
    return false;
  }
}


CacheClient.prototype.getReadFileName = function (request) {
  if (this.isInOverrideCache(request)) {
    return this.requestPathOverride(request);
  }

  if (this.isInCached(request)) {
    return this.requestPath(request);
  }

  return this.requestPath(request);
}


CacheClient.prototype.getWriteFileName = function (request) {
  if (this.overrideCacheDir) {
    return this.requestPathOverride(request);
  }
  return this.requestPath(request);
}


CacheClient.prototype.writeToAccessFile = function (filePath) {
  if (!this.accessLogFile) {
    return;
  }
  fs.appendFile(this.accessLogFile, filePath + '\n', (err) => {
    if (err) throw err;
  });
}


CacheClient.prototype.fetch = function (request) {
  var filePath = this.getReadFileName(request);
  this.logger.debug(Color.blue('Serving'), filePath);
  this.writeToAccessFile(filePath);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {return reject(err);}
      resolve(Util.parseJSON(data));
    });
  });
}


CacheClient.prototype.record = function (request, response) {
  return new Promise((resolve, reject) => {
    response.request.headers = HeaderUtil.filterHeaders(this.cacheHeader, request.headers);
    response.headers = HeaderUtil.removeHeaders(this.responseHeaderBlacklist, response.headers);
    var responseString = Util.stringify(response) + "\n";

    var writeToFile = () => {
      if (this.passthrough) {return resolve(response);}
      var targetFile = this.getWriteFileName(request);
      this.writeToAccessFile(targetFile);
      fs.writeFile(targetFile, responseString, (err) => {
        if (err) {return reject(err);}
        resolve(response);
      });
    };

    var directory = this.directory(request, this.overrideCacheDir || this.cacheDir);
    if (!FileSystemHelper.directoryExists(directory)) {
      return FileSystemHelper.createDirectory(directory).then(writeToFile);
    }
    writeToFile();
  });
}


CacheClient.prototype.remove = function (request, originalFilename) {
  return new Promise((resolve, reject) => {
    var directory = this.directory(request, this.cacheDir);
    if (FileSystemHelper.directoryExists(directory)) {
      var filePath = originalFilename ? originalFilename : this.getReadFileName(request);
      fs.unlink(filePath, (error) => {
        if (!error) {
          return resolve();
        }

        var message = 'Unable to Delete File: ' + filePath;
        this.logger.error(message, error);
        return reject(error)
      });
    } else {
      this.logger.info('Path does not exist for request. Skipping action.');
      resolve();
    }
  });
}


CacheClient.prototype.directory = function (request, rootDir) {
  var requestPath = request.path || '';
  var pathEndsSlash = requestPath.lastIndexOf('/') == path.length - 1
  requestPath = pathEndsSlash ? requestPath.substr(0, requestPath.length - 1) : requestPath;
  requestPath = requestPath.split('/').map(replaceQueryParam).join('/').toLowerCase();

  return path.join(rootDir, requestPath);
}


CacheClient.prototype.requestPathOverride = function (request) {
  var requestHash = this.requestHash(request);
  var directory = this.directory(request, this.overrideCacheDir);

  return path.join(directory, requestHash) + EXT;
}


CacheClient.prototype.requestPath = function (request) {
  var requestHash = this.requestHash(request);
  var directory = this.directory(request, this.cacheDir);

  return path.join(directory, requestHash) + EXT;
}


CacheClient.prototype.requestHash = function (request) {
  return new RequestHash(request, this.cacheHeader, this.whiteLabel, this.ignoreJsonBodyPath)
    .toString()
    .substr(0,10);
}

module.exports = CacheClient
