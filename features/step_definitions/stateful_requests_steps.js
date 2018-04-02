import {Given, Then, When} from 'cucumber';
import http from 'http';

Given(/^I provide the following transition config$/, function (string, done) {
  try {
    this.options.transitionConfig = JSON.parse(string);
    done();
  } catch (error) {
    done(error);
  }
});


When(/^I make a "([^"]*)" request to "([^"]*)"$/, function (method, path, done) {
  let options = {
    hostname: 'localhost',
    port: this.options.port,
    path: path,
    method: method
  }

  let req = http.request(options, (response) => {
    let str = '';
    response.on('data', (chunk) => {str += chunk;});
    response.on('end', () => {
      this.result = str;
      done(str ? undefined : 'Empty Response');
    });
    response.on('error', (error) => { done('Error during request:' + error) });
  });
  req.on('error', (error) => { done('Error during request:' + error) });
  req.end();
});


Then(/^I can see (\d+) cache files for "([^"]*)"$/, function (count, path, done) {
  let files = this.cacheFiles(this.options.cacheDir, path);
  done(files.length == parseInt(count, 10) ? undefined : 'Expected to see ' + count + " cache files, but found "+ files.length);
});


Then(/^I see the result "([^"]*)"$/, function (result, done) {
  let msg = [
    'Expected Result Not Found',
    'Expected: ' + result,
    'Found: ' + this.result
  ].join('\n');

  done(this.result.indexOf(result) > -1  ? undefined : msg);
});
