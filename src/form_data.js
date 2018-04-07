import crypto from 'crypto';
import R from 'ramda';
import Util from './util';

let FORM_MULTIPART = 'multipart/form-data';
let FORM_URL_ENCODED = 'application/x-www-form-urlencoded';
let CONTENT_TYPE = 'content-type';
let CONTENT_LENGTH = 'content-length';


export function isFormData(headers) {
  headers = headers || {}
  return headers[CONTENT_TYPE] && headers[CONTENT_TYPE].match(FORM_MULTIPART);
}


export function getBoundary(headers) {
  let contentType = headers[CONTENT_TYPE]
  let matches = contentType.match(/.*boundary="?([^"]*)"?/);
  return matches[1] || '';
}


export function getNewBoundary(boundary, body) {
  let strippedBody = body.replace(new RegExp(boundary, 'g'), '-');
  let signature = boundaryHash(strippedBody);

  return signature;
}


export function boundaryHash(string) {
  let shasum = crypto.createHash('sha1');
  shasum.update(string);
  return 'mockingjays' + shasum.digest('hex');
};


export const setHeaderBoundary = R.curry(function(oldBoundary, newBoundary, newRequest) {
  let {headers, body} = newRequest;
  let updatedBoundary = headers[CONTENT_TYPE].replace(new RegExp(oldBoundary, 'g'), newBoundary)
  let updateHeaders = R.compose(
    R.assoc(CONTENT_TYPE, updatedBoundary),
    R.assoc(CONTENT_LENGTH, body.length)
  )
  return R.assoc('headers', updateHeaders(headers), newRequest);
})


export const setBodyBoundary = R.curry(function(oldBoundary, newBoundary, request) {
  return R.assoc('body', request.body.replace(new RegExp(oldBoundary, 'g'), newBoundary), request)
});


export function updateBoundary(request) {
  let {headers, body} = request;
  if (!isFormData(headers)) {
    return request;
  }

  let oldBoundary = getBoundary(headers);
  let newBoundary = getNewBoundary(oldBoundary, body);

  return R.compose(
    setHeaderBoundary(oldBoundary, newBoundary),
    setBodyBoundary(oldBoundary, newBoundary)
  )(request);
}

export default {
  boundaryHash,
  getNewBoundary,
  getBoundary,
  isFormData,
  setHeaderBoundary,
  setBodyBoundary,
  updateBoundary
}