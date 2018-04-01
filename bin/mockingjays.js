#!/usr/bin/env node
import Mockingjays from '../index';
import HelpMenu from './help_menu';
import OptionParser from './option_parser';

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