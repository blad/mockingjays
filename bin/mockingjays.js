#!/usr/bin/env node
var Mockingjays = require('../index');
var HelpMenu = require('./help_menu');
var OptionParser = require('./option_parser');
var userOptions = OptionParser.parse(process.argv);

switch (true) {
  case OptionParser.shouldDisplayHelp(userOptions):
    HelpMenu();
    break;
  case OptionParser.shouldDisplayVersion(userOptions):
    var pjson = require('../package.json');
    console.log('Mockingjays v' + pjson.version);
    break;
  case OptionParser.shouldRehash(userOptions):
    new Mockingjays().rehash(userOptions);
    break;
  case OptionParser.shouldServe(userOptions):
    new Mockingjays().start(userOptions);
    break;
  default:
    console.log('Error Parsing Options. Expected: serve, rehash, --help, or --version');
    HelpMenu();
}
