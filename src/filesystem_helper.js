var fs = require('fs');
var path = require('path');
var Logger = require('./logger');
var joinArray = function (acc, next) {return acc.concat(next);};

var FileSystemHelper = {
  logger: new Logger()
};

FileSystemHelper.directoryExists = function (filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (e) {
    return false;
  }
}

FileSystemHelper.createDirectory = function (directoryPath) {
  return new Promise(function (resolve, reject) {
    FileSystemHelper.createDirectoryParent(directoryPath, function (error) {
      if (error) {
        var errorMessage = 'Failed to Create Directory: ' + directoryPath;
        FileSystemHelper.logger.error('Failed to Create Directory: ' + directoryPath, error);
        reject('Failed to Create Directory: ' + directoryPath);
      } else {
        FileSystemHelper.logger.info('Successfully Created Directory: ' + directoryPath);
        resolve();
      }
    });
  });
}

FileSystemHelper.createDirectoryParent = function (directoryPath, callback) {
  fs.mkdir(directoryPath, (error) => {
    if (error && error.code === 'ENOENT') {
      FileSystemHelper.createDirectoryParent(path.dirname(directoryPath),
        FileSystemHelper.createDirectoryParent.bind(this, directoryPath, callback));
    } else if (callback) {
      callback(error);
    }
  });
}

FileSystemHelper.findFileType = function (root, typePredicate) {
  var formattedRoot = root.lastIndexOf('/') != root.length - 1 ? root + '/' : root;
  try {
    return fs
      .readdirSync(formattedRoot)
      .filter((file) => file != '.' && file != '..')
      .map((file)  => formattedRoot + file)
      .filter(typePredicate);
  } catch (error) {
    return []; // No Matches
  }
}


FileSystemHelper.findDirectories = function (root) {
  return FileSystemHelper
    .findFileType(root, FileSystemHelper.directoryExists)
    .map(function (dir) {return FileSystemHelper.findDirectories(dir);})
    .reduce(joinArray, [root]);
}



module.exports = FileSystemHelper;
