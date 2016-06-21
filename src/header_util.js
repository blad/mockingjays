HEADER_WHITE_LIST = [
  'accept',
  'authorization',
  'content-length',
  'content-type',
  // OPTIONS Headers
  'origin',
  'access-control-request-method',
  'access-control-request-headers'
];

var isInWhiteList = function(key, headers) {
  var inWhiteList = HEADER_WHITE_LIST.indexOf(key) !== -1;
  if (inWhiteList) {
    // Only include content length of non-zero length.
    return !(key === 'content-length' && headers[key] === "0");
  }
  return false;
};


KNOWN_TEXTUAL_CONTENT_TYPES = [
  'application/json',
  'text/plain',
  'text/html'
];

// Helper Reduction Function that take the cu
var getTextualContentTypeReducer = function (contentType) {
  return function (isTextual, current) {
    // Treating a missing content type as a textual type.
    return isTextual || !contentType || contentType.indexOf(current) != -1;
  }
}



HeaderUtil = {
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
HeaderUtil.filterHeaders =  function (wantedHeaders, requestHeaders) {
  var headers = {};
  var key;
  wantedHeaders = wantedHeaders || [];
  for (var index = 0; index < wantedHeaders.length; index++) {
    key = wantedHeaders[index];
    if (requestHeaders[key]) {
      headers[key] = requestHeaders[key];
    }
  }
  return headers;
};


/**
 * Remove the target header fromt the header object
 *
 * wantedHeader - Array of headers to remove
 * requestHeaders - Object of headers.
 */
HeaderUtil.removeHeaders =  function (targetHeader, requestHeaders) {
  var headers = {};
  targetHeader = targetHeader || [];
  for (var key in requestHeaders) {
    if (targetHeader.indexOf(key.toLowerCase()) == -1) {
      headers[key] = requestHeaders[key];
    }
  }
  return headers;
};



/**
 * Returns an Object of the CORS Headers
 */
HeaderUtil.getCorsHeaders = function (origin) {
  if (!origin) {
    origin = '*'
  }

  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Accept,Origin,Authorization',
    'Access-Control-Allow-Methods': 'HEAD,OPTIONS,GET,PUT,POST,DELETE',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Max-Age': '1800'
  };
};


/**
 * Remove Headers which Might Vary from agent to agent.
 * Variability in headers leads to a different hash for and file signatures.
 */
HeaderUtil.standardize = function (requestHeaders) {
  var headers = HeaderUtil.sortHeaders(requestHeaders);
  var allowedHeaders = {};
  for (var key in headers) {
    if (isInWhiteList(key, headers)) {
      allowedHeaders[key] = headers[key];
    }
  }

  return allowedHeaders;
}


/**
 * Sort the Order of the Headers Object
 *
 * requestHeaders - Object of headers to sort.
 */
HeaderUtil.sortHeaders = function (requestHeaders) {
  // Sort the keys to get predictable order in object keys.
  var keys = [];
  for (var key in requestHeaders) {
    keys.push(key);
  }
  keys.sort();

  // Copy the Keys in order:
  var headers = {};
  keys.forEach(function(key) {
    // Standardize the key to be lowercase:
    headers[key.toLowerCase()] = requestHeaders[key];
  });

  return headers;
};


module.exports = HeaderUtil
