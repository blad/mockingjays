import fs from 'fs';
import path from 'path';

import Colorize from './colorize';
import FileSystemHelper from './filesystem_helper';
import RequestHash from './request_hash';
import HeaderUtil from './header_util';
import Util from './util';

const RW_MODE = fs.F_OK | fs.R_OK | fs.W_OK;
const EXT = '.json';

let replaceQueryParam = function (directoryName) {
  let queryParamStartIndex = directoryName.indexOf('?');

  if (queryParamStartIndex == -1) {
    return directoryName;
  }

  return directoryName.substr(0, queryParamStartIndex);
};

let CacheClient = function (options) {
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
};


CacheClient.prototype.isCached = function (request) {
  if (this.passthrough) { return false; }
  return this.isInOverrideCache(request) || this.isInCached(request);
};


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
};


CacheClient.prototype.isInCached = function (request) {
  try {
    fs.accessSync(this.requestPath(request), RW_MODE);
    return true;
  } catch (error) {
    return false;
  }
};


CacheClient.prototype.getReadFileName = function (request) {
  if (this.isInOverrideCache(request)) {
    return this.requestPathOverride(request);
  }

  if (this.isInCached(request)) {
    return this.requestPath(request);
  }

  return this.requestPath(request);
};


CacheClient.prototype.getWriteFileName = function (request) {
  if (this.overrideCacheDir) {
    return this.requestPathOverride(request);
  }
  return this.requestPath(request);
};


CacheClient.prototype.writeToAccessFile = function (filePath) {
  if (!this.accessLogFile) {
    return;
  }
  fs.appendFile(this.accessLogFile, filePath + '\n', (err) => {
    if (err) throw err;
  });
};


CacheClient.prototype.fetch = function (request) {
  let filePath = this.getReadFileName(request);
  this.logger.debug(Colorize.blue('Serving'), filePath);
  this.writeToAccessFile(filePath);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) { return reject(err); }
      resolve(Util.parseJSON(data));
    });
  });
};


CacheClient.prototype.record = function (request, response) {
  return new Promise((resolve, reject) => {
    response.request.headers = HeaderUtil.filterHeaders(this.cacheHeader, request.headers);
    response.headers = HeaderUtil.removeHeaders(this.responseHeaderBlacklist, response.headers);
    let responseString = Util.stringify(response) + '\n';

    let writeToFile = () => {
      if (this.passthrough) { return resolve(response); }
      let targetFile = this.getWriteFileName(request);
      this.writeToAccessFile(targetFile);
      fs.writeFile(targetFile, responseString, (err) => {
        if (err) { return reject(err); }
        resolve(response);
      });
    };

    let directory = this.directory(request, this.overrideCacheDir || this.cacheDir);
    if (!FileSystemHelper.directoryExists(directory)) {
      return FileSystemHelper.createDirectory(directory).then(writeToFile);
    }
    writeToFile();
  });
};


CacheClient.prototype.remove = function (request, originalFilename) {
  return new Promise((resolve, reject) => {
    let directory = this.directory(request, this.cacheDir);
    if (FileSystemHelper.directoryExists(directory)) {
      let filePath = originalFilename ? originalFilename : this.getReadFileName(request);
      fs.unlink(filePath, (error) => {
        if (!error) {
          return resolve();
        }

        let message = 'Unable to Delete File: ' + filePath;
        this.logger.error(message, error);
        return reject(error);
      });
    } else {
      this.logger.info('Path does not exist for request. Skipping action.');
      resolve();
    }
  });
};


CacheClient.prototype.directory = function (request, rootDir) {
  let requestPath = request.path || '';
  let pathEndsSlash = requestPath.lastIndexOf('/') == path.length - 1;
  requestPath = pathEndsSlash ? requestPath.substr(0, requestPath.length - 1) : requestPath;
  requestPath = requestPath.split('/').map(replaceQueryParam).join('/').toLowerCase();

  return path.join(rootDir, requestPath);
};


CacheClient.prototype.requestPathOverride = function (request) {
  let requestHash = this.requestHash(request);
  let directory = this.directory(request, this.overrideCacheDir);

  return path.join(directory, requestHash) + EXT;
};


CacheClient.prototype.requestPath = function (request) {
  let requestHash = this.requestHash(request);
  let directory = this.directory(request, this.cacheDir);

  return path.join(directory, requestHash) + EXT;
};


CacheClient.prototype.requestHash = function (request) {
  return new RequestHash(request, this.cacheHeader, this.whiteLabel, this.ignoreJsonBodyPath)
    .toString()
    .substr(0,10);
};

export default CacheClient;
