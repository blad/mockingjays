import FileSystemHelper from '../../src/filesystem_helper';
import path from 'path';

function World() {
  this.cacheFiles = function(cacheDir, endpoint) {
    var cwd = process.cwd();
    var isFile = function (filePath) { return !FileSystemHelper.directoryExists(filePath); };
    return FileSystemHelper.findFileType(path.join(cwd, cacheDir, endpoint), isFile);
  }

  this.logFile = function(cacheDir, logFile) {
    var cwd = process.cwd();
    var isFile = function (filePath) { return filePath.indexOf(logFile) > -1;};
    return FileSystemHelper.findFileType(path.join(cwd, cacheDir), isFile);
  }
}

export default function() {
  this.World = World;
};
