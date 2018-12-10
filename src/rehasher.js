import FileSystem from 'fs';
import Url from 'url';

import CacheClient from './cache_client';
import FileSystemHelper from './filesystem_helper';
import HeaderUtil from './header_util';
import Logger from './logger';
import QueryStringUtil from './query_string_util';
import Util from './util';

let Rehashser = function (options) {
  this.logger = new Logger();
  this.options = options;

  if (!FileSystemHelper.directoryExists(options.cacheDir)) {
    this.logger.warn('Sorry, Looks like the cache directory does not exist!');
    this.logger.warn('We can not rehash if there are no cache files available. Check the path and try again.');
    this.logger.warn('Remember to use an absolute path to the cache directory.');
    process.exit(1);
  }

  this.cacheClient = new CacheClient(options);
}

Rehashser.prototype.process = function () {
  FileSystemHelper
  .findDirectories(this.options.cacheDir)
  .forEach(this.rehashWithOptions(this.options))
}


Rehashser.prototype.rehashWithOptions = function(options) {
  return root => {
    let notADirectory = function(file) {return !FileSystemHelper.directoryExists(file)};
    FileSystemHelper
      .findFileType(root, notADirectory)
      .forEach(file => {
        this
          .getContents(file)
          .then(cachedContents => {
            let originalCachedContents = Util.parseJSON(Util.stringify(cachedContents));
            this.updateResponseWithOptions(cachedContents);
            this.updateRequestWithOptions(cachedContents);
            this.updateFile(file, cachedContents, originalCachedContents);
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
        let cachedData = Util.parseJSON(data);
        resolve(cachedData);
      }
    });
  });
}

Rehashser.prototype.updateResponseWithOptions = function(cacheContent) {
  let reducedHeaders = HeaderUtil.removeHeaders(this.options.responseHeaderBlacklist, cacheContent.headers);
  cacheContent.headers = reducedHeaders;
}

Rehashser.prototype.updateRequestWithOptions = function(cacheContent) {
  let filteredHeaders =  HeaderUtil.filterHeaders(this.options.cacheHeaders, cacheContent.request.headers);
  let urlInfo = Url.parse(this.options.serverBaseUrl); // Update Base Server URL

  cacheContent.request.path = QueryStringUtil.filterQueryParameters(
    this.options.queryParameterBlacklist,
    cacheContent.request.path
  );

  cacheContent.request.hostname = urlInfo.hostname;
  cacheContent.request.headers = filteredHeaders;
  cacheContent.request.port = Util.determinePort(urlInfo);
  cacheContent.request.transaction = cacheContent.request.transaction || '';
}

Rehashser.prototype.updateFile = function(filePath, cacheContent, originalCachedContents) {
  let cacheClient = this.cacheClient;
  if (cacheClient.isCached(cacheContent.request)) {
    this.logger.info('Updating Contents for for File:', filePath);
    cacheClient.record(cacheContent.request, cacheContent);
  } else {
    this.logger.info('Hash Changed for Request. Renaming File for Request: ', cacheContent.request.path);
    cacheClient
      .record(cacheContent.request, cacheContent)
      .then(function() {
        cacheClient.remove(originalCachedContents.request, filePath);
      });
  }
}

export default Rehashser;
