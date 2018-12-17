import fs from 'fs';
import path from 'path';
import R from 'ramda';
import Logger from './logger';


const logger = new Logger();
const isDirectory = (path) => fs.statSync(path).isDirectory();
export const directoryExists = R.tryCatch(isDirectory, R.F);


export const createDirectory = function (directoryPath) {
  return new Promise(function (resolve, reject) {
    createDirectoryParent(directoryPath, function (error) {
      if (error) {
        logger.error('Failed to Create Directory: ' + directoryPath, error);
        return reject('Failed to Create Directory: ' + directoryPath);
      }

      logger.info('Successfully Created Directory: ' + directoryPath);
      resolve();
    });
  });
};

export const createDirectoryParent = function (directoryPath, callback) {
  fs.mkdir(directoryPath, (error) => {
    if (error && error.code === 'ENOENT') {
      let parentDirectory = path.dirname(directoryPath);
      let createCurrentDirectoryCallback = createDirectoryParent.bind(null, directoryPath, callback);
      return createDirectoryParent(parentDirectory, createCurrentDirectoryCallback);
    }

    return callback(error);
  });
};


export const findDirectories = function (root) {
  return R.transduce(R.map(findDirectories), R.flip(R.append), [root], findFileType(root, directoryExists));
};

const formatRootPath = (root) => root.lastIndexOf('/') != root.length - 1 ? root + '/' : root;

export const findFileType = function (root, typePredicate) {
  let formattedRoot = formatRootPath(root);
  try {
    let findFileTypes = R.compose(
      R.filter((file) => file != '.' && file != '..'),
      R.map((file)  => formattedRoot + file),
      R.filter(typePredicate)
    );
    return R.transduce(findFileTypes, R.flip(R.append), [], fs.readdirSync(formattedRoot));
  } catch (error) {
    return []; // No Matches
  }
};


export default {
  createDirectory,
  createDirectoryParent,
  directoryExists,
  findDirectories,
  findFileType
};
