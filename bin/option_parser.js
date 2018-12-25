import parseArgs from 'minimist';
import R from 'ramda';

let OptionsParser = {};

let findCommand = R.find((arg) => arg == 'serve' || arg == 'rehash');
let setCommand = R.assoc('command');

OptionsParser.parse = function (processArgs) {
  let userArgs = parseArgs(processArgs.slice(2));
  let command = findCommand(userArgs._);
  delete userArgs._; // Done Extracting Values
  return setCommand(command, userArgs);
};


OptionsParser.shouldDisplayHelp = function (options) {
  return options.command == 'help' || options.help || R.length(R.keys(options)) == 0;
};


OptionsParser.shouldDisplayVersion = function (options) {
  return options.command == 'version' || options.version;
};


OptionsParser.shouldRehash = function (options) {
  return options.command == 'rehash';
};


OptionsParser.shouldServe = function (options) {
  let isTrue = R.identity;
  return R.none(isTrue, [
    OptionsParser.shouldDisplayHelp(options),
    OptionsParser.shouldDisplayVersion(options),
    OptionsParser.shouldRehash(options)
  ]);
};


export default OptionsParser;
