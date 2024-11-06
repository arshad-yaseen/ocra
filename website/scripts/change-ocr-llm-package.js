const fs = require('fs');
const path = require('path');

const rootPackagePath = path.join(__dirname, '..', '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const ocrllmVersion = rootPackage.version;

const websitePackagePath = path.join(__dirname, '..', 'package.json');
const websitePackage = JSON.parse(fs.readFileSync(websitePackagePath, 'utf8'));

websitePackage.dependencies.ocrllm = ocrllmVersion;

fs.writeFileSync(
  websitePackagePath,
  JSON.stringify(websitePackage, null, 2) + '\n',
  'utf8',
);

console.log(`Updated ocr-llm package version to ${ocrllmVersion}`);
