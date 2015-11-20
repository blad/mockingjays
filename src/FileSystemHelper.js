var FileSystem = require('fs');

var FileSystemHelper = {};

FileSystemHelper.directoryExists = function (path) {
  var mode = FileSystem.F_OK | FileSystem.R_OK | FileSystem.W_OK;
  try {
    fs.accessSync(path, mode);
    return true;
  } catch (e) {
    return false;
  }
}


FileSystemHelper.createDirectory = function (path) {
  return new Promise(function (resolve, reject) {
    FileSystem.mkdir(path, function (error) {
      if (error) {
        var errorMessage = 'Failed to Create Directory: ' + path;
        console.warn('Failed to Create Directory: ' + path, error);
        reject('Failed to Create Directory: ' + path);
      } else {
        console.log('Successfully Created Directory: ' + path);
        resolve();
      }
    });
  });
}

module.exports = FileSystemHelper;
