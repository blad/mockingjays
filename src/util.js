Util = {
  simpleCopy: function (target) {
    newObject = JSON.parse(JSON.stringify(target));
    return newObject;
  }
}
module.exports = Util
