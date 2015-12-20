#!/usr/bin/env node
var Mockingjays = require('../mockingjays')
var HelpMenu = require('./help_menu')
var OptionParser = require('./option_parser')
var userOptions = OptionParser.parse(process.argv);

if (userOptions['help'] || process.argv.length == 2) {
  HelpMenu();
} else if (userOptions['version']) {
  var pjson = require('../package.json');
  console.log('Mockingjays v' + pjson.version);
} else {
  new Mockingjays().start(userOptions);
}
