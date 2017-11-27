Mockingjays = require('../../index');
path = require('path');

module.exports = function () {

  this.Given(/^I want to create a Mockingjay instance with no options$/, function (done) {
    this.options = {};
    done();
  });

  this.Given(/^I want to create a Mockingjay instance with the following options$/, function (optionsTable, done) {
    var options = {}
    optionsTable.rows().forEach(function (row) {
      return options[row[0]] = row[1];
    });
    this.options = options;
    done();
  });

  this.When(/^I serve$/, function (done) {
    try {
      this.mockingjay = new Mockingjays().start(this.options);
    } catch (error) {
      this.error = error;
    }
    done()
  });

  this.When(/^I see an error asking me to specify missing options$/, function (done) {
    done(!this.error ? 'Expected Error for Missing Options!' : undefined);
  });

  this.Then(/^I see no error$/, function (done) {
    done(this.error ? 'Did Not Expec to See Error: ' + this.error : undefined);
  });
};
