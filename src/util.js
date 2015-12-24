Util = {};
Util.determinePort = function (urlInfo) {
  var isHttps = urlInfo.protocol === 'https:'
  return parseInt(urlInfo.port) || (isHttps ? 443 : 80);
}


Util.stringify = function (inputObject) {
  var jsonObject = inputObject || '';

  try {
    switch (typeof(jsonObject)) {
      case 'object':
        return JSON.stringify(jsonObject, null, 2);
      case 'string':
        return jsonObject
      case 'function':
        return '[Function]'
      default:
        return jsonObject.toString();
    }
  } catch (error) {
    console.warn('Error While Stringifying Object: ', error);
    return jsonObject.toString();
  }
}


Util.parseJSON = function (jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return jsonString;
  }
}


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
