import fs, { NoParamCallback } from "fs";

import path from "path";

export const createDirectory = (
  filePath: string,
  callback: NoParamCallback
) => {
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (error) => {
      if (error) callback(error);
      else {
        callback(null);
        console.log(`🗂  Directory Created :> '${filePath}'`);
      }
    });
  } else {
    callback(null);
  }
};

export const deleteDirectory = (filePath: string, callback: NoParamCallback) =>
  fs.rm(filePath, { recursive: true }, callback);

export const saveFile = (
  filePath: string,
  fileData: string | NodeJS.ArrayBufferView,
  callback: NoParamCallback
) => fs.writeFile(filePath, fileData, { flag: "w" }, callback);

export const deleteFile = (filePath: string, callback: NoParamCallback) =>
  fs.unlink(filePath, callback);

export const getAbsolutePath = (relativePath: string) =>
  path.resolve(`${relativePath}`);

export const readFile = async (relativePath: string) => {
  return await new Promise<string>((resolve, reject) => {
    fs.readFile(relativePath, "utf8", (error, data) => resolve(data));
  }).then((data: string) => data);
};
