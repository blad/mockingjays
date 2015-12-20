var OptionsParser = {}

OptionsParser.parse = function(processArgs) {
  var userArgs = processArgs.slice(2);
  var result = {};
  userArgs.map(function(arg) {
    if (arg.indexOf('--') == -1) {
      if (arg != 'serve' && arg != 'rehash') {
        console.log('\nUnknown Command:', arg, '\n');
      }
    }
    return arg.replace('--','').split('=');
  }).forEach(function(pair) {
    result[pair[0]] = pair[1] || true;
  });

  return result;
}


OptionsParser.shouldDisplayHelp = function (options) {
  var argCount = 0;
  for (var key in options) {
    argCount++;
  }
  return Boolean(options['help'] || argCount == 0);
}


OptionsParser.shouldDisplayVersion = function (options) {
  return Boolean(options['version']);
}


OptionsParser.shouldRehash = function (options) {
  return Boolean(options['rehash']);
}


OptionsParser.shouldServe = function (options) {
  var displayHelpMenu = OptionsParser.shouldDisplayHelp(options);
  var displayVersionNumber = OptionsParser.shouldDisplayVersion(options);
  var rehash = OptionsParser.shouldRehash(options);

  return !displayHelpMenu && !displayVersionNumber && !rehash;
}


module.exports = OptionsParser
