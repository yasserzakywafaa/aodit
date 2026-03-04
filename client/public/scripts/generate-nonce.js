const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BUILD_DIR_NAME = "build";
const INDEX_HTML_FILE_NAME = "index.html";
const NONCE_FILE_NAME = ".csp-nonce";
const CUSTOM_HEADERS_FILE_NAME = "customHttp.yml";
const NONCE_PLACEHOLDER = "%NONCE_PLACEHOLDER%";

/**
 * @description Resolves a path relative to the script's directory.
 * @param {...string} paths - Path segments to join.
 * @returns {string} - The resolved path.
 */
const resolvePath = (...paths) => path.resolve(__dirname, ...paths);

/**
 * @description Generates a cryptographically secure random nonce.
 * @returns {string} - The generated nonce.
 */
const generateNonce = () => {
  const nonce = crypto.randomBytes(16).toString("base64");
  console.log(`[Nonce Script] Generated nonce: ${nonce}`);
  return nonce;
};

/**
 * @description Checks if a directory exists.
 * @param {string} dirPath - The path to the directory.
 * @returns {boolean} - True if the directory exists, false otherwise.
 */
const directoryExists = (dirPath) =>
  fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();

/**
 * @description Checks if a file exists.
 * @param {string} filePath - The path to the file.
 * @returns {boolean} - True if the file exists, false otherwise.
 */
const fileExists = (filePath) =>
  fs.existsSync(filePath) && fs.statSync(filePath).isFile();

/**
 * @description Reads a file's content.
 * @param {string} filePath - The path to the file.
 * @returns {string} - The file's content.
 * @throws {Error} - If the file does not exist.
 */
const readFile = (filePath) => {
  if (!fileExists(filePath)) {
    throw new Error(`[Nonce Script] ERROR: File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
};

/**
 * @description Writes content to a file.
 * @param {string} filePath - The path to the file.
 * @param {string} content - The content to write.
 */
const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`[Nonce Script] Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`[Nonce Script] ERROR: Failed to write ${filePath}`, error);
  }
};

/**
 * @description Injects the nonce into the index.html file.
 * @param {string} indexHtml - The content of the index.html file.
 * @param {string} nonce - The nonce to inject.
 * @returns {string} - The modified index.html content.
 */
const injectNonceIntoIndexHtml = (indexHtml, nonce) => {
  let modifiedIndexHtml = indexHtml;

  // Use Regex to find the placeholder, allowing for optional slash and whitespace variations
  const placeholderRegex =
    /<meta\s+name="csp-nonce"\s+content="%NONCE_PLACEHOLDER%"\s*\/?>/;
  const replacement = `<meta name="csp-nonce" content="${nonce}">`; // Replace with a standard meta tag

  // Add nonce to meta tag placeholder
  if (placeholderRegex.test(modifiedIndexHtml)) {
    modifiedIndexHtml = modifiedIndexHtml.replace(
      placeholderRegex,
      replacement,
    );
  }

  // Add nonce to <script> tags
  const scriptRegex = /(<script(?![^>]*nonce=)([^>]*))>/g;
  const scriptReplacement = `$1 nonce="${nonce}">`;
  modifiedIndexHtml = modifiedIndexHtml.replace(scriptRegex, scriptReplacement);

  // Add nonce to <style> tags
  const styleRegex = /(<style(?![^>]*nonce=)([^>]*))>/g;
  const styleReplacement = `$1 nonce="${nonce}">`;
  modifiedIndexHtml = modifiedIndexHtml.replace(styleRegex, styleReplacement);

  return modifiedIndexHtml;
};

/**
 * @description Injects the nonce into the customHttp.yml file.
 * @param {string} customHeadersContent - The content of the customHttp.yml file.
 * @param {string} nonce - The nonce to inject.
 * @returns {string} - The modified customHttp.yml content.
 */
const injectNonceIntoCustomHeaders = (customHeadersContent, nonce) =>
  customHeadersContent.replace(/nonce-\$NONCE/g, `nonce-${nonce}`);

/**
 * @description Main function to process the build files.
 */
const processBuildFiles = () => {
  console.log(`[Nonce Script] Started.`);

  // --- Paths ---  const buildDir = resolvePath("..", BUILD_DIR_NAME);
  const buildDir = resolvePath("..", "..", BUILD_DIR_NAME);
  const buildIndexPath = resolvePath(
    "..",
    "..",
    BUILD_DIR_NAME,
    INDEX_HTML_FILE_NAME,
  );
  const nonceFilePath = resolvePath(
    "..",
    "..",
    BUILD_DIR_NAME,
    NONCE_FILE_NAME,
  );
  const customHeadersPath = resolvePath(
    "..",
    "..",
    "..",
    CUSTOM_HEADERS_FILE_NAME,
  );

  // --- Validation ---
  if (!directoryExists(buildDir)) {
    console.error(
      `[Nonce Script] ERROR: Build directory not found: ${buildDir}`,
    );
    console.error(
      "[Nonce Script] Please run 'npm run build' or 'yarn build' first.",
    );
    process.exit(1);
  }
  console.log(`[Nonce Script] Build directory exists: ${buildDir}`);

  // --- Generate Nonce ---
  const nonce = generateNonce();

  // --- Process index.html ---
  console.log(`[Nonce Script] Reading index.html from: ${buildIndexPath}`);
  let indexHtml = readFile(buildIndexPath);
  indexHtml = injectNonceIntoIndexHtml(indexHtml, nonce);
  writeFile(buildIndexPath, indexHtml);

  // --- Process customHttp.yml (if it exists) ---
  if (fileExists(customHeadersPath)) {
    console.log(`[Nonce Script] customHttp.yml found at ${customHeadersPath}`);
    let customHeadersContent = readFile(customHeadersPath);
    customHeadersContent = injectNonceIntoCustomHeaders(
      customHeadersContent,
      nonce,
    );
    writeFile(customHeadersPath, customHeadersContent);
  } else {
    console.warn(
      `[Nonce Script] WARNING: customHttp.yml not found at ${customHeadersPath}`,
    );
  }

  // --- Save Nonce ---
  writeFile(nonceFilePath, nonce);

  console.log(`[Nonce Script] Finished successfully.`);
};

// --- Run the script ---
processBuildFiles();
