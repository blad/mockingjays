import http from 'http';
import querystring from 'querystring';

import {Then, When} from 'cucumber';
import R from 'ramda';
import {expect} from 'mocha';

When('I make a {string} request to {string} with the query parameters:',
  function (method, path, table, done) {
    const queryString = querystring.stringify(table.rowsHash());
    const options = {
      hostname: 'localhost',
      port: this.options.port,
      path: path + queryString,
      method
    };

    const req = http.request(options, function(response) {
      let data = [];

      response.on('data', chunk => data.push(chunk));
      response.on('end', function() {
        this.result = data;
        console.log('RESULT', this.result);
        done(data ? undefined : 'Empty Response');
      });
      response.on('error', () => done('Error during request.'));
    });

    req.on('error', () => done('Error during request.'));
    req.end();
});

Then("the {string} cache file doesn't contain the following query strings keys:",
  function (table) {
    const blacklistedKeys = table.raw();
    const files = this.cacheFiles(this.options.cacheDir, path);

    if (files.length != 1) {
      console.error(`Expecting one file for form-data. ${files.length} found.`);
      return;
    }

    const fileContents = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}))
    const queryStringValues = querystring.parse(fileContents.request.path);

    const cacheFileContains = R.pipe(
      R.keys(queryStringValues),
      R.contains(expectedBlacklistedQueryStringKeys)
    );

    expect(cacheFileContains(blacklistedKeys)).to.be.false;
});
