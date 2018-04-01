export default function() {

  this.When(/^I can see the log file "([^"]*)"$/, function (logFileName, done) {
    var files = this.logFile(this.options.cacheDir, logFileName);
    done(files.length  ? undefined : 'Expected to see log file:' + logFileName + ", but found "+ files.length + " files");
  });
};