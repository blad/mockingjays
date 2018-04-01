import crypto from 'crypto';
import Util from './util';

var FORM_MULTIPART = 'multipart/form-data';
var FORM_URL_ENCODED = 'application/x-www-form-urlencoded';
var CONTENT_TYPE = 'content-type';
var CONTENT_LENGTH = 'content-length';


var FormDataHandler = {}


FormDataHandler.isFormData = function (headers) {
  headers = headers || {}
  return headers[CONTENT_TYPE] && headers[CONTENT_TYPE].match(FORM_MULTIPART);
}


FormDataHandler.getBoundary = function (contentType) {
  var matches = contentType.match(/.*boundary="?([^"]*)"?/);
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
  return 'mockingjays' + shasum.digest('hex');
};


FormDataHandler.setHeaderBoundary = function (oldBoundary, newBoundary, newRequest) {
  var {headers, body} = newRequest;
  headers[CONTENT_TYPE] = headers[CONTENT_TYPE].replace(new RegExp(oldBoundary, 'g'), newBoundary);
  headers[CONTENT_LENGTH] = body.length;

  return headers;
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

  newRequest.body = FormDataHandler.setBodyBoundary(oldBoundary, newBoundary, body);
  newRequest.headers = FormDataHandler.setHeaderBoundary(oldBoundary, newBoundary, newRequest);

  return newRequest;
}

export default FormDataHandler;
