import { Then, When } from 'cucumber';
import fs from 'fs';
import http from 'http';


When(/^I wait$/, { timeout: 60 * 1000 * 5 }, function () {
  return new Promise(() => {});
});


When(/^I make a form data request to "([^"]*)"$/, function (path, done) {
  let postData = '--AaB03x\r\n' +
    'content-disposition: form-data; name="x"\r\n' +
    '\r\n' +
    'Hello World\r\n' +
    '--AaB03x--\r\n';

  let options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path,
    headers: {
      'content-type': 'multipart/form-data; boundary=AaB03x',
    },
    method: 'POST'
  };

  let req = http.request(options, function (response) {
    let str = '';
    response.on('data', function (chunk) { str += chunk; });
    response.on('end', function () {
      this.result = str;
      done(str ? undefined : 'Empty Response');
    });
    response.on('error', function (error) { done('Error during request:' + error); });
  });
  req.on('error', function (error) { done('Error during request:' + error); });
  req.end(postData);
});


Then(/^the boundary is a mockingjays boundary$/, function (done) {
  let files = this.cacheFiles(this.options.cacheDir, '/formData');
  if (files.length != 1) {
    done('Expecting 1 file for form-data. ' + files.length + ' found');
    return;
  }
  let generatedJSON = JSON.parse(fs.readFileSync(files[0], { encoding: 'utf-8' }));
  let hasUpdatedBoundary = generatedJSON.request.body.match('mockingjay');

  done(!hasUpdatedBoundary ? 'Missing Mockingjays Boundary in Form Data' : null);
});

When(/^I make a POST request to "([^"]*)" with the JSON body:$/, function (path, postData, done) {
  let options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path,
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  };

  let req = http.request(options, function (response) {
    let str = '';
    response.on('data', function (chunk) { str += chunk; });
    response.on('end', function () {
      this.result = str;
      done(str ? undefined : 'Empty Response');
    });
    response.on('error', function () { done('Error during request.'); });
  });
  req.on('error', function () { done('Error during request.'); });
  req.write(JSON.stringify(JSON.parse(postData)));
  req.end();
});
