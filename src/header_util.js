import R from 'ramda';

const HEADER_WHITE_LIST = [
  'accept',
  'authorization',
  'content-length',
  'content-type',
  // OPTIONS Headers
  'origin',
  'access-control-request-method',
  'access-control-request-headers'
];


const KNOWN_TEXTUAL_CONTENT_TYPES = [
  'application/json',
  'text/plain',
  'text/html'
];


let isInWhiteList = R.curry((key, value) => {
  let isAllowed = R.find(R.equals(key), HEADER_WHITE_LIST)
  let isNonEmptyContentLength = !(key === 'content-length' && value === "0");
  return isAllowed && isNonEmptyContentLength
});


// Helper Reduction Function that take the cu
let getTextualContentTypeReducer = R.curry((contentType, isTextual, current) => {
  // Treating a missing content type as a textual type.
  return isTextual || !contentType || (contentType.indexOf(current) > -1);
})


let HeaderUtil = {
  HEADER_WHITE_LIST: HEADER_WHITE_LIST,
  KNOWN_TEXTUAL_CONTENT_TYPES: KNOWN_TEXTUAL_CONTENT_TYPES
};


/**
 * Returns a function that returns true if the content type is *likely* to be of non-text content-type
 *
 * contentType - String Content Type to consider
 */
HeaderUtil.isText = function (contentType) {
  return KNOWN_TEXTUAL_CONTENT_TYPES.reduce(getTextualContentTypeReducer(contentType), false);
};


/**
 * Filter the headers object and keep only the headers specified.
 *
 * wantedHeader - Array of headers to keep.
 * requestHeaders - Object of headers to filter.
 */
HeaderUtil.filterHeaders =  R.curry((wantedHeaders, requestHeaders) => {
  let keepWanted = (targetObject, key) =>
    requestHeaders[key] ? R.assoc(key, requestHeaders[key], targetObject) : targetObject;

  return R.reduce(keepWanted, {}, wantedHeaders || []);
});


/**
 * Remove the target header fromt the header object
 *
 * wantedHeader - Array of headers to remove
 * requestHeaders - Object of headers.
 */
HeaderUtil.removeHeaders =  function (targetHeader, requestHeaders) {
  return R.reduce((obj, key) => R.dissoc(key, obj), requestHeaders, targetHeader || [])
};


/**
 * Returns an Object of the CORS Headers
 */
HeaderUtil.getCorsHeaders = function (origin) {
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Accept,Origin,Authorization',
    'Access-Control-Allow-Methods': 'HEAD,OPTIONS,GET,PUT,POST,DELETE',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Max-Age': '1800'
  };
};


/**
 * Remove Headers which Might Vary from agent to agent.
 * Variability in headers leads to a different hash for and file signatures.
 */
HeaderUtil.standardize = function (requestHeaders) {
  let entries = R.toPairs(HeaderUtil.sortHeaders(requestHeaders));
  let transform = R.filter(R.apply(isInWhiteList));
  let reducer = (targetObj, [key, value]) => R.assoc(key, value, targetObj);

  return R.transduce(transform, reducer, {}, entries);
}


/**
 * Sort the Order of the Headers Object
 *
 * requestHeaders - Object of headers to sort.
 */
HeaderUtil.sortHeaders = function (requestHeaders) {
  // Sort the keys to get predictable order in object keys.
  return R.map(R.toLower, R.keys(requestHeaders))
    .sort()
    .reduce((targetObj, key) =>
      R.assoc(key, requestHeaders[key], targetObj)
    , {});
};


export default HeaderUtil;
