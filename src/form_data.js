crypto = require('crypto');
Util = require('./util');

FORM_MULTIPART = 'multipart/form-data'
FORM_URL_ENCODED = 'application/x-www-form-urlencoded'
CONTENT_TYPE = 'content-type'


FormDataHandler = {}


FormDataHandler.isFormData = function (headers) {
  return headers
  && headers[CONTENT_TYPE]
  && headers[CONTENT_TYPE].match(FORM_MULTIPART);
}


FormDataHandler.getBoundary = function (contentType) {
  var matches = contentType.match(/.*boundary="?([^"]*)"?.*/);
  return matches[1] || '';
}


FormDataHandler.getBodySignature = function (boundary, body) {
  var strippedBody = body.replace(new RegExp(boundary, 'g'), '-');
  var signature = FormDataHandler.boundaryHash(strippedBody);

  return signature;
}


FormDataHandler.boundaryHash = function (string) {
  var shasum = crypto.createHash('sha1');
  shasum.update(string);
  return '----mockingjays' + shasum.digest('hex');
};


FormDataHandler.setHeaderBoundary = function (oldBoundary, newBoundary, headers) {
  headers[CONTENT_TYPE] = headers[CONTENT_TYPE].replace(new RegExp(oldBoundary, 'g'), newBoundary);
  return headers
}


FormDataHandler.setBodyBoundary = function (oldBoundary, newBoundary, body) {
  return body.replace(new RegExp(oldBoundary, 'g'), newBoundary);
}


FormDataHandler.updateBoundary = function (request) {
  var newRequest = Util.simpleCopy(request);
  if (!FormDataHandler.isFormData(request.headers)) {
    return newRequest;
  }

  var headers = newRequest.headers;
  var body = newRequest.body;
  var oldBoundary = FormDataHandler.getBoundary(headers[CONTENT_TYPE]);
  var newBoundary = FormDataHandler.getBodySignature(oldBoundary, body);

  newRequest.headers = FormDataHandler.setHeaderBoundary(oldBoundary, newBoundary, headers);
  newRequest.body = FormDataHandler.setBodyBoundary(oldBoundary, newBoundary, body);

  return newRequest;
}

module.exports = FormDataHandler
