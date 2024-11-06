#!/usr/bin/env node

const os = require('os');
const {exec} = require('child_process');

/**
 * Main function to detect the OS and guide the user.
 */
async function main() {
  try {
    const platform = os.platform();
    console.log(`Detected platform: ${platform}\n`);

    switch (platform) {
      case 'win32':
        await guideWindows();
        break;
      case 'darwin':
        await guideMac();
        break;
      case 'linux':
        await guideLinux();
        break;
      default:
        console.error('Unsupported platform:', platform);
        process.exit(1);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

/**
 * Guides installation on Windows systems.
 */
async function guideWindows() {
  console.log('Checking installation on Windows...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled = await checkIfInstalled('gswin64c', ['--version']);

  if (!isGmInstalled) {
    console.log('GraphicsMagick is not installed.\n');
    console.log(
      'Please download and install GraphicsMagick from the official website:',
    );
    console.log('http://www.graphicsmagick.org\n');
  } else {
    console.log('GraphicsMagick is already installed.\n');
  }

  if (!isGsInstalled) {
    console.log('Ghostscript is not installed.\n');
    console.log(
      'Please download and install Ghostscript from the official website:',
    );
    console.log('https://www.ghostscript.com/download/gsdnld.html\n');
  } else {
    console.log('Ghostscript is already installed.\n');
  }
}

/**
 * Guides installation on macOS systems.
 */
async function guideMac() {
  console.log('Checking installation on macOS...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled = await checkIfInstalled('gs', ['--version']);

  if (isGmInstalled) {
    console.log('GraphicsMagick is already installed.\n');
  } else {
    console.log('GraphicsMagick is not installed.\n');
  }

  if (isGsInstalled) {
    console.log('Ghostscript is already installed.\n');
  } else {
    console.log('Ghostscript is not installed.\n');
  }

  if (!isGmInstalled || !isGsInstalled) {
    const isBrewInstalled = await checkIfInstalled('brew', ['--version']);
    if (isBrewInstalled) {
      if (!isGmInstalled) {
        console.log(
          'You can install GraphicsMagick using Homebrew with the following command:',
        );
        console.log('brew install graphicsmagick\n');
      }
      if (!isGsInstalled) {
        console.log(
          'You can install Ghostscript using Homebrew with the following command:',
        );
        console.log('brew install ghostscript\n');
      }
    } else {
      console.log('Homebrew is not installed.\n');
      console.log('Please install GraphicsMagick and Ghostscript manually.\n');
      console.log('GraphicsMagick download: http://www.graphicsmagick.org\n');
      console.log(
        'Ghostscript download: https://www.ghostscript.com/download/gsdnld.html\n',
      );
    }
  }
}

/**
 * Guides installation on Linux systems.
 */
async function guideLinux() {
  console.log('Checking installation on Linux...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled = await checkIfInstalled('gs', ['--version']);

  const packageManager = await detectPackageManager();

  if (!packageManager) {
    console.error(
      'No supported package manager found. Please install GraphicsMagick and Ghostscript manually.',
    );
    return;
  }

  if (!isGmInstalled || !isGsInstalled) {
    console.log(
      `You can install the necessary packages using ${packageManager}.\n`,
    );
    console.log('Required packages: graphicsmagick, ghostscript\n');

    const commands = {
      'apt-get':
        'sudo apt-get update && sudo apt-get install graphicsmagick ghostscript',
      yum: 'sudo yum install graphicsmagick ghostscript',
      dnf: 'sudo dnf install graphicsmagick ghostscript',
      pacman: 'sudo pacman -Sy graphicsmagick ghostscript',
      zypper: 'sudo zypper install graphicsmagick ghostscript',
    };

    console.log('Suggested command:');
    console.log(commands[packageManager] + '\n');
  }

  if (isGmInstalled) {
    console.log('GraphicsMagick is already installed.\n');
  }

  if (isGsInstalled) {
    console.log('Ghostscript is already installed.\n');
  }
}

/**
 * Checks if a command is available on the system.
 * @param {string} command - Command to check.
 * @param {Array} args - Arguments for the command.
 * @returns {Promise<boolean>}
 */
async function checkIfInstalled(command, args = []) {
  return new Promise(resolve => {
    exec(`${command} ${args.join(' ')}`, error => {
      resolve(!error);
    });
  });
}

/**
 * Detects the package manager on Linux.
 * @returns {Promise<string|null>}
 */
async function detectPackageManager() {
  const managers = ['apt-get', 'yum', 'dnf', 'pacman', 'zypper'];
  for (const manager of managers) {
    if (await checkIfInstalled(manager, ['--version'])) {
      return manager;
    }
  }
  return null;
}

main();
