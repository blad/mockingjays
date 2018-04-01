import parseArgs from 'minimist';
import _ from 'lodash';

var OptionsParser = {}

var hasCommand = (arg) => arg == 'serve' || arg == 'rehash'

OptionsParser.parse = function(processArgs) {
  var userArgs = parseArgs(processArgs.slice(2));
  var command = _.find(userArgs._, hasCommand)
  delete userArgs._ // Argument are parse. Done Extracting Values
  return _.extend(userArgs, {command: command})
}


OptionsParser.shouldDisplayHelp = function (options) {
  var argCount = 0;
  for (var key in options) {
    argCount++;
  }
  return options.command == 'help' || options.help || argCount == 0;
}


OptionsParser.shouldDisplayVersion = function (options) {
  return options.command == 'version' || options.version;
}


OptionsParser.shouldRehash = function (options) {
  return options.command == 'rehash';
}


OptionsParser.shouldServe = function (options) {
  var displayHelpMenu = OptionsParser.shouldDisplayHelp(options);
  var displayVersionNumber = OptionsParser.shouldDisplayVersion(options);
  var rehash = OptionsParser.shouldRehash(options);
  return !displayHelpMenu && !displayVersionNumber && !rehash;
}


export default OptionsParser;
