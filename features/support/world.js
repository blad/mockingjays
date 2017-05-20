var FileSystemHelper = require('../../src/filesystem_helper');
var path = require('path');

function World() {
  this.cacheFiles = function(cacheDir, endpoint) {
    var cwd = process.cwd();
    var isFile = function (filePath) { return !FileSystemHelper.directoryExists(filePath); };
    return FileSystemHelper.findFileType(path.join(cwd, cacheDir, endpoint), isFile);
  }
}

module.exports = function() {
  this.World = World;
};
