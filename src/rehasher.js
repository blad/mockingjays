var FileSystemHelper = require('./filesystem_helper');
var FileSystem = require('fs');
var Url = require('url');
var Util = require('./util');
var HeaderUtil = require('./header_util');
var CacheClient = require('./cache_client');

var Rehashser = function (options) {
  this.options = options;

  if (!FileSystemHelper.directoryExists(options.cacheDir)) {
    console.warn('\nSorry, Looks like the cache directory does not exist!\n');
    console.log('We can not rehash if there are no cache files available. Check the path and try again.');
    console.log('Remember to use an absolute path to the cache directory.');
    process.exit(1);
  }

  this.cacheClient = new CacheClient(options);
}

Rehashser.prototype.process = function () {
  var self = this;
  FileSystemHelper
  .findDirectories(this.options.cacheDir)
  .forEach(this.rehashWithOptions(this.options))
}


Rehashser.prototype.rehashWithOptions = function(options) {
  var self = this;
  return function (root) {
    var notADirectory = function(file) {return !FileSystemHelper.directoryExists(file)};
    FileSystemHelper
      .findFileType(root, notADirectory)
      .forEach(function (file) {
        self.getContents(file)
        .then(function(cachedContents) {
          var originalCachedContents = Util.parseJSON(Util.stringify(cachedContents));
          self.updateResponseWithOptions(cachedContents);
          self.updateRequestWithOptions(cachedContents);
          self.updateFile(file, cachedContents, originalCachedContents);
        });
      });
  }
}

Rehashser.prototype.getContents = function(file) {
  return new Promise(function(resolve, reject) {
    FileSystem.readFile(file, function (err, data) {
      if (err) {
        reject(err);
      } else {
        var cachedData = Util.parseJSON(data);
        resolve(cachedData);
      }
    });
  });
}

Rehashser.prototype.updateResponseWithOptions = function(cacheContent) {
  var reducedHeaders = HeaderUtil.removeHeaders(this.options.responseHeaderBlacklist, cacheContent.headers);
  cacheContent.headers = reducedHeaders;
}

Rehashser.prototype.updateRequestWithOptions = function(cacheContent) {
  var filteredHeaders =  HeaderUtil.filterHeaders(this.options.cacheHeaders, cacheContent.request.headers);
  cacheContent.request.headers = filteredHeaders;

  // Update Base Server URL
  var urlInfo = Url.parse(this.options.serverBaseUrl);

  cacheContent.request.hostname = urlInfo.hostname;
  cacheContent.request.headers = filteredHeaders;
  cacheContent.request.port = Util.determinePort(urlInfo);
}

Rehashser.prototype.updateFile = function(filePath, cacheContent, originalCachedContents) {
  var cacheClient = this.cacheClient;
  if (cacheClient.isCached(cacheContent.request)) {
    console.log('Updating Contents for for File:', filePath);
    cacheClient.record(cacheContent.request, cacheContent);
  } else {
    console.log('Hash Changed for Request. Renaming File for Request: ', cacheContent.request.path);
    cacheClient
      .record(cacheContent.request, cacheContent)
      .then(function() {
        cacheClient.remove(originalCachedContents.request);
      });
  }
}

module.exports = Rehashser;
