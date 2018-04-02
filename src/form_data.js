import crypto from 'crypto';
import Util from './util';

let FORM_MULTIPART = 'multipart/form-data';
let FORM_URL_ENCODED = 'application/x-www-form-urlencoded';
let CONTENT_TYPE = 'content-type';
let CONTENT_LENGTH = 'content-length';


let FormDataHandler = {}


FormDataHandler.isFormData = function (headers) {
  headers = headers || {}
  return headers[CONTENT_TYPE] && headers[CONTENT_TYPE].match(FORM_MULTIPART);
}


FormDataHandler.getBoundary = function (contentType) {
  let matches = contentType.match(/.*boundary="?([^"]*)"?/);
  return matches[1] || '';
}


FormDataHandler.getBodySignature = function (boundary, body) {
  let strippedBody = body.replace(new RegExp(boundary, 'g'), '-');
  let signature = FormDataHandler.boundaryHash(strippedBody);

  return signature;
}


FormDataHandler.boundaryHash = function (string) {
  let shasum = crypto.createHash('sha1');
  shasum.update(string);
  return 'mockingjays' + shasum.digest('hex');
};


FormDataHandler.setHeaderBoundary = function (oldBoundary, newBoundary, newRequest) {
  let {headers, body} = newRequest;
  headers[CONTENT_TYPE] = headers[CONTENT_TYPE].replace(new RegExp(oldBoundary, 'g'), newBoundary);
  headers[CONTENT_LENGTH] = body.length;

  return headers;
}


FormDataHandler.setBodyBoundary = function (oldBoundary, newBoundary, body) {
  return body.replace(new RegExp(oldBoundary, 'g'), newBoundary);
}


FormDataHandler.updateBoundary = function (request) {
  let newRequest = Util.simpleCopy(request);
  if (!FormDataHandler.isFormData(request.headers)) {
    return newRequest;
  }

  let headers = newRequest.headers;
  let body = newRequest.body;
  let oldBoundary = FormDataHandler.getBoundary(headers[CONTENT_TYPE]);
  let newBoundary = FormDataHandler.getBodySignature(oldBoundary, body);

  newRequest.body = FormDataHandler.setBodyBoundary(oldBoundary, newBoundary, body);
  newRequest.headers = FormDataHandler.setHeaderBoundary(oldBoundary, newBoundary, newRequest);

  return newRequest;
}

export default FormDataHandler;
