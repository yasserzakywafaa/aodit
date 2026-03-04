import CONFIG from "../config";
import { Express } from "express";
import fs from "fs";
import path from "path";

const loadRoutes = async (expressApp: Express) => {
  const routesPath = path.resolve(__dirname);
  const filesExtension = CONFIG.IS_DEV ? ".ts" : ".js";

  fs.readdirSync(routesPath).forEach((file) => {
    // Skip the index file to prevent self-importing
    if (file !== `index${filesExtension}` && file.endsWith(filesExtension)) {
      const route = require(path.join(routesPath, file)).default;
      if (route) expressApp.use(route);
    }
  });
};

export default loadRoutes;
