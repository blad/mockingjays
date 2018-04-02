import FileSystemHelper from '../../src/filesystem_helper';
import {setWorldConstructor} from 'cucumber';
import path from 'path';

function World() {
  this.cacheFiles = function(cacheDir, endpoint) {
    let cwd = process.cwd();
    endpoint = endpoint.toLowerCase()
    let isFile = function (filePath) { return !FileSystemHelper.directoryExists(filePath); };
    return FileSystemHelper.findFileType(path.join(cwd, cacheDir, endpoint), isFile);
  }

  this.logFile = function(cacheDir, logFile) {
    let cwd = process.cwd();
    let isFile = function (filePath) { return filePath.indexOf(logFile) > -1;};
    return FileSystemHelper.findFileType(path.join(cwd, cacheDir), isFile);
  }
}

setWorldConstructor(World)
