import Mockingjays from '../../index';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {Then, When} from 'cucumber';

const TIMEOUT = 20 * 1000;

When(/^I make a "([^"]*)" request to "([^"]*)" with headers:$/, {timeout: TIMEOUT}, function (method, urlPath, table, done) {
  var headers = {};

  table.rows().forEach(row => headers[row[0]] = row[1]);

  var options = {
    hostname: 'localhost',
    port: this.options.port,
    path: urlPath,
    method: method,
    headers: headers
  };

  var req = http.request(options, (response) => {
    var chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      this.result = chunks.join('');
      done(this.result ? undefined : 'Empty Response');
    });
    response.on('error', (error) => { done('Error during request.' + error)});
  });
  req.on('error', (error) => { done('Error during request:' + error)});
  if (method == 'GET') {
    req.end()
  } else {
    req.end(JSON.stringify({request: 'some-data'}));
  }
});


When(/^I make a GET request to "([^"]*)" with the query strings:$/, function (path, table, done) {
  var first = true;
  var queryString = table.hashes().reduce(function(qs, current) {
    var key = current.KEY;
    var val = current.VALUE;
    qs += (first ? '' : '&') + key + '=' + (isNaN(val) ? val : parseInt(val, 10));
    first = false;
    return qs;
  }, '?');

  var options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path + queryString,
    method: 'GET'
  };

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
  req.end();
});


Then(/^I see a cache file for "([^"]*)" with the following headers:$/, function (path, table, done) {
  var files = this.cacheFiles(this.options.cacheDir, path);
  if (files.length != 1) {
    done('Expecting 1 file for form-data. '+ files.length +' found');
    return;
  }

  var generatedJSON = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}));
  var requiredHeadersFound = true;

  table.rows().forEach(function(row) {
    requiredHeadersFound = requiredHeadersFound
      && generatedJSON.request.headers[row[0]]
      && generatedJSON.request.headers[row[0]] == row[1];
  });

  done(!requiredHeadersFound ? 'Missing Headers': null);
});
