const fs = require('fs');
const path = require('path');

const rootPackagePath = path.join(__dirname, '..', '..', 'package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const ocraVersion = rootPackage.version;

const websitePackagePath = path.join(__dirname, '..', 'package.json');
const websitePackage = JSON.parse(fs.readFileSync(websitePackagePath, 'utf8'));

websitePackage.dependencies.ocra = ocraVersion;

fs.writeFileSync(
  websitePackagePath,
  JSON.stringify(websitePackage, null, 2) + '\n',
  'utf8',
);

console.log(`Updated ocra package version to ${ocraVersion}`);
