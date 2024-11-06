#!/usr/bin/env node

const os = require('os');
const {exec} = require('child_process');
const {promisify} = require('util');

const execPromise = promisify(exec);

async function isSudoAvailable() {
  try {
    await execPromise('sudo -n true');
    return true;
  } catch {
    return false;
  }
}

async function checkAndInstall() {
  try {
    const platform = os.platform();
    const sudoAvailable = await isSudoAvailable();

    // Check and install Ghostscript
    try {
      await execPromise('gs --version');
      console.log('Ghostscript is already installed.');
    } catch {
      if (platform === 'darwin') {
        console.log('Installing Ghostscript on macOS...');
        await installPackage('brew install ghostscript', 'Ghostscript');
      } else if (platform === 'linux') {
        console.log('Installing Ghostscript on Linux...');
        const command = sudoAvailable
          ? 'sudo apt-get update && sudo apt-get install -y ghostscript'
          : 'apt-get update && apt-get install -y ghostscript';
        await installPackage(command, 'Ghostscript');
      } else {
        throw new Error(
          'Please install Ghostscript manually from https://www.ghostscript.com/download.html',
        );
      }
    }

    // Check and install GraphicsMagick
    try {
      await execPromise('gm -version');
      console.log('GraphicsMagick is already installed.');
    } catch {
      if (platform === 'darwin') {
        console.log('Installing GraphicsMagick on macOS...');
        await installPackage('brew install graphicsmagick', 'GraphicsMagick');
      } else if (platform === 'linux') {
        console.log('Installing GraphicsMagick on Linux...');
        const command = sudoAvailable
          ? 'sudo apt-get update && sudo apt-get install -y graphicsmagick'
          : 'apt-get update && apt-get install -y graphicsmagick';
        await installPackage(command, 'GraphicsMagick');
      } else {
        throw new Error(
          'Please install GraphicsMagick manually from http://www.graphicsmagick.org/download.html',
        );
      }
    }

    console.log('All dependencies are installed.');
  } catch (err) {
    showManualInstallationGuide();
    process.exit(0);
  }
}

async function installPackage(command, packageName) {
  try {
    console.log(`Executing: ${command}`);
    const {stdout, stderr} = await execPromise(command);
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    console.log(`${packageName} installed successfully.`);
  } catch (error) {
    throw new Error(`Failed to install ${packageName}: ${error.message}`);
  }
}

function showManualInstallationGuide() {
  console.log('\nPlease install the required packages manually:');
  console.log('GraphicsMagick: http://www.graphicsmagick.org/download.html');
  console.log('Ghostscript: https://www.ghostscript.com/download/gsdnld.html');
}

checkAndInstall();
