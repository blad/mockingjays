var FileSystem = require('fs');
var path = require('path');

var FileSystemHelper = {};

FileSystemHelper.directoryExists = function (path) {
  try {
    return FileSystem.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

FileSystemHelper.createDirectory = function (path) {
  return new Promise(function (resolve, reject) {
    FileSystemHelper.createDirectoryParent(path, function (error) {
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

FileSystemHelper.createDirectoryParent = function (dirPath, callback) {
  FileSystem.mkdir(dirPath, function (error) {
    if (error && error.code === 'ENOENT') {
      FileSystemHelper.createDirectoryParent(path.dirname(dirPath),
        FileSystemHelper.createDirectoryParent.bind(this, dirPath, callback));
    } else if (callback) {
      callback(error);
    }
  });
}

module.exports = FileSystemHelper;
