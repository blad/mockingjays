import crypto from 'crypto';
import qs from 'querystring';
import R from 'ramda';
import Util from './util';
import HeaderUtil from './header_util';

const JSON_STUBED_VALUE = '---omitted-by-proxy---';
const WHITELABEL_HOSTNAME = 'example.com';
const WHITELABEL_PORT = 80;

const stringifyBody = R.ifElse(
  R.has('body'),
  R.converge(
    R.assoc('body'), [
      R.compose(JSON.stringify, R.prop('body')),
      R.identity
    ]
  ),
  R.identity
);


const makeHostAndPortAgnostic = R.compose(
  R.assoc('hostname', WHITELABEL_HOSTNAME),
  R.assoc('port', WHITELABEL_PORT)
);

const composeSignature = R.compose(computeHash, JSON.stringify, Util.sortObjectKeys, stringifyBody);

function computeHash (payload) {
  let shasum = crypto.createHash('sha1');
  shasum.update(payload);
  return shasum.digest('hex');
}


let RequestHash = function ({ cacheHeaders, queryParameterBlacklist, ignoreJsonBodyPath, request, whiteLabel }) {
  this.request = request;
  this.cacheHeaders = cacheHeaders;
  this.whiteLabel = whiteLabel;
  this.ignoreJsonBodyPath = ignoreJsonBodyPath;
  this.queryParameterBlacklist = queryParameterBlacklist;
};


RequestHash.prototype.toString = function () {
  return composeSignature(this._filteredAttributes());
};

function stubIgnoredJsonPaths (payload, path) {
  if (typeof (payload.body) !== 'object') {
    return payload;
  }

  let updatedPath = ['body'].concat(path.split('.'));
  let jsonPath = R.lensPath(updatedPath);

  return R.ifElse(
    R.view(jsonPath),
    R.set(jsonPath, JSON_STUBED_VALUE),
    R.identity
  )(payload);
}

function removeQueryParam (queryParam) {
  return (parameterString) => {
    const params = qs.parse(parameterString);
    const filteredParams = Object.keys(params).reduce((finalParams, key) => {
      if (key == queryParam) {
        return finalParams;
      }
      finalParams[key] = params[key];
      return finalParams;
    }, {});

    return '?' + qs.stringify(filteredParams);
  };
}

function removeBlacklistedQueryParams (payload, queryParam) {
  const { path } = payload;
  const [urlPath, parameters] = path.split('?');
  const newParameters = R.ifElse(
    R.isEmpty,
    R.always(''),
    removeQueryParam(queryParam)
  )(parameters);

  return R.assoc('path', urlPath + newParameters, payload);
}


RequestHash.prototype._filteredAttributes = function () {
  return R.compose(
    R.reduce(stubIgnoredJsonPaths, R.__, this.ignoreJsonBodyPath || []),
    R.reduce(removeBlacklistedQueryParams, R.__, this.queryParameterBlacklist || []),
    R.ifElse(R.always(this.whiteLabel), makeHostAndPortAgnostic, R.identity),
    R.converge(
      R.assoc('headers'), [
        R.compose(HeaderUtil.filterHeaders(this.cacheHeaders), R.prop('headers')),
        R.identity
      ]),
  )(this.request);
};

export default RequestHash;
