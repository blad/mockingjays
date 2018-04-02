import parseArgs from 'minimist';
import _ from 'lodash';

let OptionsParser = {}

let hasCommand = (arg) => arg == 'serve' || arg == 'rehash'

OptionsParser.parse = function(processArgs) {
  let userArgs = parseArgs(processArgs.slice(2));
  let command = _.find(userArgs._, hasCommand)
  delete userArgs._ // Argument are parse. Done Extracting Values
  return _.extend(userArgs, {command: command})
}


OptionsParser.shouldDisplayHelp = function (options) {
  let argCount = 0;
  for (let key in options) {
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
  let displayHelpMenu = OptionsParser.shouldDisplayHelp(options);
  let displayVersionNumber = OptionsParser.shouldDisplayVersion(options);
  let rehash = OptionsParser.shouldRehash(options);
  return !displayHelpMenu && !displayVersionNumber && !rehash;
}


export default OptionsParser;
