Util = {};

Util.simpleCopy = function (target) {
  return JSON.parse(JSON.stringify(target));
}


Util.regExArrayContains = function (regExArray, value) {
  var inList = function (expressionMatched, next) {
    var matchList = new RegExp(next).exec(value);
    return expressionMatched || Boolean(matchList && matchList.length > 0);
  };
  return regExArray.reduce(inList, false);
}

module.exports = Util
