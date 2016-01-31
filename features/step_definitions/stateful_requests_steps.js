var http = require('http');
module.exports = function() {
  var self = this;

  this.Given(/^I have a source server running on:$/, function (options, done) {
    var options = options.hashes()[0];
    this.sourceServer = {};
    this.sourceServer.host = options['HOST'];
    this.sourceServer.port = options['PORT'];
    done();
  });

  this.Given(/^I have a cache directory at "([^"]*)"$/, function (cacheDirctoryPath, done) {
    this.cacheDirectoryRoot = cacheDirctoryPath;
    done();
  });

  this.Given(/^I provide the following transition config$/, function (string, done) {
    try {
      this.inputOptions.transitionConfig = JSON.parse(string);
      done();
    } catch (error) {
      done(error);
    }
  });

  this.When(/^I make a "([^"]*)" request to "([^"]*)"$/, function (method, path, done) {
    var options = {
      hostname: this.sourceServer.host,
      port: this.parsedOptions.port,
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
      response.on('error', function(error){ done('Error during request. ' + error)});
    });
    req.on('error', function(error){ done('Error during request. ' + error)});
    req.end();
  });

  this.Then(/^I can see (\d+) cache files for "([^"]*)"$/, function (count, path, done) {
    var files = this.cacheFiles(this.cacheDirectoryRoot, path);
    done(files.length == parseInt(count, 10) ? undefined : 'Expected to see ' + count + " cache files, but found "+ files.length);
  });

  this.Then(/^I see the result "([^"]*)"$/, function (result, done) {
    done(self.result === result ? undefined : 'Expected Result Not Found');
  });
}
