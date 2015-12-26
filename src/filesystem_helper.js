var FileSystem = require('fs');
var path = require('path');
var Logger = require('./logger');
var joinArray = function (acc, next) {return acc.concat(next);};

var FileSystemHelper = {
  logger: new Logger()
};

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
        FileSystemHelper.logger.error('Failed to Create Directory: ' + path, error);
        reject('Failed to Create Directory: ' + path);
      } else {
        FileSystemHelper.logger.info('Successfully Created Directory: ' + path);
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

FileSystemHelper.findFileType = function (root, typePredicate) {
  var formattedRoot = root.lastIndexOf('/') != root.length - 1 ? root + '/' : root;

  return FileSystem
  .readdirSync(formattedRoot)
  .filter(function (file) { return file != '.' && file != '..';})
  .map(function (file) { return formattedRoot + file;})
  .filter(typePredicate);
}


FileSystemHelper.findDirectories = function (root) {
  return FileSystemHelper.findFileType(root, FileSystemHelper.directoryExists)
  .map(function (dir) {return FileSystemHelper.findDirectories(dir);})
  .reduce(joinArray, [root]);
}



module.exports = FileSystemHelper;
