import http from 'http';
import querystring from 'querystring';

import {Then, When} from 'cucumber';
import R from 'ramda';
import {expect} from 'mocha';

When('I make a {string} request to {string} with the query string values:',
  function (method, path, table, done) {
    const queryString = querystring.stringify(table.rowsHash());
    const options = {
      hostname: 'localhost',
      port: this.options.port,
      path: path + queryString,
      method
    };

    const req = http.request(options, function(response) {
      let str = '';

      response.on('data', chunk => str += chunk);
      response.on('end', function() {
        this.result = str;
        done(str ? undefined : 'Empty Response');
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

    const cacheFileContainsBlacklistedKeys = R.pipe(
      R.keys(queryStringValues)
      R.contains(expectedBlacklistedQueryStringKeys)
    )(blacklistedKeys);

    expect(cacheFileContainsBlacklistedKeys).to.be.false;
});
