import {Then, When} from 'cucumber';
import fs from 'fs';
import http from 'http';


When(/^I wait$/, {timeout: 60 * 1000 * 5}, function () {
  return new Promise(() => {})
});


When(/^I make a form data request to "([^"]*)"$/, function (path, done) {
  var options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path,
    headers: {
      'content-type': 'multipart/form-data; boundary="---TestBoundaryXYZ123"'
    },
    method: 'POST'
  };

  var postData = '---TestBoundaryXYZ123\r\nContent-Type: application/octet-stream\r\n\r\nHello World\r\n---TestBoundaryXYZ123--\r\n'

  var req = http.request(options, function(response) {
    var str = '';
    response.on('data', function (chunk) {str += chunk;});
    response.on('end', function() {
      this.result = str;
      done(str ? undefined : 'Empty Response');
    });
    response.on('error', function(){ done('Error during request.')});
  });
  req.on('error', function(){ done('Error during request.')});
  req.write(postData)
  req.end();
});


Then(/^the boundary is a mockingjays boundary$/, function (done) {
  var files = this.cacheFiles(this.options.cacheDir, '/formData');
  if (files.length != 1) {
    done('Expecting 1 file for form-data. '+ files.length +' found');
    return;
  }
  var generatedJSON = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}));
  var hasUpdatedBoundary = generatedJSON.request.body.match('mockingjay');

  done(!hasUpdatedBoundary ? 'Missing Mockingjays Boundary in Form Data': null);
});

When(/^I make a POST request to "([^"]*)" with the JSON body:$/, function (path, postData, done) {
  var options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path,
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  }

  var req = http.request(options, function(response) {
    var str = '';
    response.on('data', function(chunk) {str += chunk;});
    response.on('end', function() {
      this.result = str;
      done(str ? undefined : 'Empty Response');
    });
    response.on('error', function(){ done('Error during request.')});
  });
  req.on('error', function(){ done('Error during request.')});
  req.write(JSON.stringify(JSON.parse(postData)));
  req.end();
});
