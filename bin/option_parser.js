var OptionsParser = {}

OptionsParser.parse = function(processArgs) {
  var userArgs = processArgs.slice(2);
  var result = {};
  userArgs.map(function(arg) {
    return arg.substr(2).split('=');
  }).forEach(function(pair) {
    result[pair[0]] = pair[1];
  })

  return result;
}

module.exports = OptionsParser
