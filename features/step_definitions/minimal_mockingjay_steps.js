import Mockingjays from '../../index';
import {Given, Then, When} from 'cucumber';
import path from 'path';

Given(/^I want to create a Mockingjay instance with no options$/, function (done) {
  this.options = {};
  done();
});


Given(/^I want to create a Mockingjay instance with the following options$/, function (optionsTable, done) {
  let options = {}
  optionsTable.rows().forEach(function (row) {
    return options[row[0]] = row[1];
  });
  this.options = options;
  this.options.port = this.options.port || 9000;
  done();
});


When(/^I serve$/, function (done) {
  try {
    this.mockingjay = new Mockingjays().start(this.options, done);
  } catch (error) {
    this.error = error;
    done()
  }
});


When(/^I see an error asking me to specify missing options$/, function (done) {
  done(!this.error ? 'Expected Error for Missing Options!' : undefined);
});


Then(/^I see no error$/, function (done) {
  done(this.error ? 'Did Not Expec to See Error: ' + this.error : undefined);
});
