'use strict';

require('util.promisify').shim();
import {promisify} from 'util';
import {stat, readdir, lstat} from 'fs';
import path from 'path';


const readdirP = promisify(readdir);
const lstatP = promisify(lstat);
const statP=promisify(stat);

async function findFilesByExt(startPath, extFilter) {
  const doesExist = await statP(startPath);
  if (!doesExist) {
    return Promise.reject(new Error('path' + startPath + ' does not exists'));
  }
  let result = [];
  const files = await readdirP(startPath);
  for (const file of files) {
    const filename = path.join(startPath, file);
    const stat = await lstatP(filename);
    if (stat.isDirectory()) {
      const subResult = await findFilesByExt(filename, extFilter);
      if (subResult.length != 0) {
        result = [
          ...subResult,
          ...result,
        ];
      }
    } else if (extFilter.indexOf(path.extname(filename)) >= 0) {
      result.push(filename);
    };
  };
  return result;
};

export default findFilesByExt;
