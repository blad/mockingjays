Util = {};

Util.simpleCopy = function (target) {
  return JSON.parse(JSON.stringify(target));
}

module.exports = Util
