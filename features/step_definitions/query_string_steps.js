import fs from 'fs';
import http from 'http';
import querystring from 'querystring';

import R from 'ramda';
import {Then, When} from 'cucumber';
import {expect} from 'chai';

When('I make a {word} request to {string} with the query parameters:',
  function (method, rawPath, table, done) {
    const queryString = querystring.stringify(table.rowsHash());
    const path = queryString ? rawPath : `${rawPath}?${queryString}`;

    const options = {
      hostname: 'localhost',
      port: this.options.port,
      path,
      method
    };

    const req = http.request(options, function(response) {
      let data = [];

      response.on('data', chunk => data.push(chunk));
      response.on('end', function() {
        this.result = data;
        done(data ? undefined : 'Empty Response');
      });
      response.on('error', () => done('Error during request.'));
    });

    req.on('error', () => done('Error during request.'));
    req.end();
});

Then("the {string} cache file doesn't contain the following query parameters:",
  function (path, table) {
    const blacklistedKeys = table.raw();
    const files = this.cacheFiles(this.options.cacheDir, path);

    if (files.length != 1) {
      console.error(`Expecting one file for form-data. ${files.length} found.`);
      return;
    }

    const fileContents = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}));
    const queryParameterValues = querystring.parse(fileContents.request.path);
    const queryParameterKeys = Object.keys(queryParameterValues);

    blacklistedKeys.forEach(key =>
      expect(queryParameterKeys.includes(key)).to.be.false
    );
});
