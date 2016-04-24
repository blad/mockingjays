var http = require('http');
var fs = require('fs');

module.exports = function() {
  var self = this;

  this.When(/^I wait$/, function (done) {});


  this.When(/^I make a form data request to "([^"]*)"$/, function (path, done) {
    var options = {
      hostname: 'localhost',
      port: this.options.port,
      path: path,
      headers: {
        'content-type': 'multipart/form-data; boundary="---TestBoundaryXYZ123"'
      },
      method: 'POST'
    }

    var postData = '---TestBoundaryXYZ123\r\nContent-Type: application/octet-stream\r\n\r\nHello World\r\n---TestBoundaryXYZ123--\r\n'

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
    req.write(postData)
    req.end();
  });


  this.Then(/^the boundary is a mockingjays boundary$/, function (done) {
    var files = this.cacheFiles(this.options.cacheDir, '/formData');
    if (files.length != 1) {
      done('Expecting 1 file for form-data. '+ files.length +' found');
    }
    var generatedJSON = JSON.parse(fs.readFileSync(files[0], {encoding: 'utf-8'}));
    var hasUpdatedBoundary = generatedJSON.request.body.match('mockingjay');

    done(!hasUpdatedBoundary ? 'Missing Mockingjays Boundary in Form Data': null);
  });
};
