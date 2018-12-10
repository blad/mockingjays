import Mockingjays from '../../index';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {Then, When} from 'cucumber';

const TIMEOUT = 20 * 1000;

When(/^I make a "([^"]*)" request to "([^"]*)" with headers:$/, {timeout: TIMEOUT}, function (method, urlPath, table, done) {
  let headers = {};

  table.rows().forEach(row => headers[row[0]] = row[1]);

  let options = {
    hostname: 'localhost',
    port: this.options.port,
    path: urlPath,
    method: method,
    headers: headers
  };

  let req = http.request(options, (response) => {
    let chunks = [];
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

Then(/^I see a cache file for "([^"]*)" with the following headers:$/, function (path, table, done) {
  let files = this.cacheFiles(this.options.cacheDir, path);
  if (files.length != 1) {
    done('Expecting 1 file for form-data. '+ files.length +' found');
    return;
  }

  let generatedJSON = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}));
  let requiredHeadersFound = true;

  table.rows().forEach(function(row) {
    requiredHeadersFound = requiredHeadersFound
      && generatedJSON.request.headers[row[0]]
      && generatedJSON.request.headers[row[0]] == row[1];
  });

  done(!requiredHeadersFound ? 'Missing Headers': null);
});

Then('I see one cache file for {string}', function (path, table, done) {
  let files = this.cacheFiles(this.options.cacheDir, path);
  const errorMsg = `Expecting 1 file for form-data. ${files.length} found`;

  expect(files.length, errorMsg).to.equal(1);
});
