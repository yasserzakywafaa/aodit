const fs = require("fs");
const path = require("path");

const now = new Date();
const version = now
  .toISOString()
  .replace(/[-:]/g, "")
  .replace("T", "-")
  .split(".")[0]; // "20260128-205230"

const swPath = path.join(__dirname, "..", "serviceworker.js");
let swContent = fs.readFileSync(swPath, "utf8");

swContent = swContent.replace(
  /const version = ".*";/,
  `const version = "${version}";`,
);

fs.writeFileSync(swPath, swContent);
console.log(`✅ SW version updated to: ${version}`);
