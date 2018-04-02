import _ from 'lodash';
import crypto from 'crypto';
import Util from './util';
import HeaderUtil from './header_util';

let RequestHash = function (request, cacheHeaders, whiteLabel, ignoreJsonBodyPath) {
  this.request = request;
  this.cacheHeaders = cacheHeaders;
  this.whiteLabel = whiteLabel;
  this.ignoreJsonBodyPath = ignoreJsonBodyPath;
};


RequestHash.prototype.toString = function () {
  let request = this._filteredAttributes();
  if (request.body) {
    // Backward Compatability Hash with Existing Fixture Files
    request.body = JSON.stringify(request.body);
  }
  let shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(Util.sortObjectKeys(request)));
  return shasum.digest('hex');
};


RequestHash.prototype._filteredAttributes = function () {
  let filteredAttributes = Util.simpleCopy(this.request);
  filteredAttributes.headers = HeaderUtil.filterHeaders(this.cacheHeaders, this.request.headers);
  if (this.whiteLabel) {
    filteredAttributes.hostname = 'example.com';
    filteredAttributes.port = 80;
  }

  if (this.ignoreJsonBodyPath && this.ignoreJsonBodyPath.length && _.isPlainObject(filteredAttributes.body)) {
    this.ignoreJsonBodyPath.forEach(function(path) {
      if (_.has(filteredAttributes.body, path)) {
        _.set(filteredAttributes.body, path, '---omitted-by-proxy---');
      }
    });
  }

  return filteredAttributes;
}

export default RequestHash;
