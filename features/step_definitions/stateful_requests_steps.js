var http = require('http');
module.exports = function() {
  var self = this;

  this.Given(/^I provide the following transition config$/, function (string, done) {
    try {
      this.options.transitionConfig = JSON.parse(string);
      done();
    } catch (error) {
      done(error);
    }
  });

  this.When(/^I make a "([^"]*)" request to "([^"]*)"$/, function (method, path, done) {
    var options = {
      hostname: 'localhost',
      port: this.options.port,
      path: path,
      method: method
    }
    var req = http.request(options, function(response) {
      var str = '';
      response.on('data', function (chunk) {str += chunk;});
      response.on('end', function() {
        self.result = str;
        done(str ? undefined : 'Empty Response');
      });
      response.on('error', function(){ done('Error during request.')});
    });
    req.on('error', function(){ done('Error during request.')});
    req.end();
  });

  this.Then(/^I can see (\d+) cache files for "([^"]*)"$/, function (count, path, done) {
    var files = this.cacheFiles(this.options.cacheDir, path);
    done(files.length == parseInt(count, 10) ? undefined : 'Expected to see ' + count + " cache files, but found "+ files.length);
  });

  this.Then(/^I see the result "([^"]*)"$/, function (result, done) {
    var msg = [
      'Expected Result Not Found',
      'Expected: ' + result,
      '\n',
      'Found: ' + self.result
    ].join('\n');
    done(self.result.indexOf(result) > -1  ? undefined : msg);
  });
}
