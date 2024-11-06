#!/usr/bin/env node

const os = require('os');
const {exec} = require('child_process');
const readline = require('readline');

function isNonInteractive() {
  return !process.stdin.isTTY || process.env.CI;
}

async function isSudoAvailable() {
  return new Promise(resolve => {
    exec('sudo -n true', error => {
      resolve(!error);
    });
  });
}

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
        console.log('Unsupported platform:', platform);
        console.log(
          'Please install GraphicsMagick and Ghostscript manually from:',
        );
        console.log(
          'GraphicsMagick: http://www.graphicsmagick.org/download.html',
        );
        console.log(
          'Ghostscript: https://www.ghostscript.com/download/gsdnld.html',
        );
    }
  } catch (error) {
    console.error('An error occurred:', error);
    console.log('Please install GraphicsMagick and Ghostscript manually from:');
    console.log('GraphicsMagick: http://www.graphicsmagick.org/download.html');
    console.log(
      'Ghostscript: https://www.ghostscript.com/download/gsdnld.html',
    );
  }
}

async function guideWindows() {
  console.log('Checking installation on Windows...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled =
    (await checkIfInstalled('gswin64c', ['--version'])) ||
    (await checkIfInstalled('gswin32c', ['--version']));

  const isChocoInstalled = await checkIfInstalled('choco', ['-v']);

  if (!isGmInstalled || !isGsInstalled) {
    if (isChocoInstalled) {
      console.log('Chocolatey package manager detected.\n');

      const toInstall = [];
      if (!isGmInstalled) toInstall.push('graphicsmagick');
      if (!isGsInstalled) toInstall.push('ghostscript');

      if (isNonInteractive()) {
        console.log(
          'Non-interactive environment detected. Proceeding with installation.',
        );
        const installCmd = `choco install ${toInstall.join(' ')} -y`;
        console.log(`\nExecuting: ${installCmd}\n`);
        exec(installCmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error during installation: ${error.message}`);
          } else {
            console.log('Installation completed successfully.');
          }
        });
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Do you want to install ${toInstall.join(' and ')} using Chocolatey? (y/n): `,
          async answer => {
            rl.close();
            if (answer.toLowerCase() === 'y') {
              const installCmd = `choco install ${toInstall.join(' ')} -y`;
              console.log(`\nExecuting: ${installCmd}\n`);
              exec(installCmd, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error during installation: ${error.message}`);
                } else {
                  console.log('Installation completed successfully.');
                }
              });
            } else {
              console.log('Installation aborted by the user.');
              showManualInstallationGuide();
            }
          },
        );
      }
    } else {
      console.log('Chocolatey is not installed.\n');
      showManualInstallationGuide();
    }
  } else {
    console.log('GraphicsMagick and Ghostscript are already installed.\n');
  }
}

async function guideMac() {
  console.log('Checking installation on macOS...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled = await checkIfInstalled('gs', ['--version']);
  const isBrewInstalled = await checkIfInstalled('brew', ['--version']);

  if (!isGmInstalled || !isGsInstalled) {
    if (isBrewInstalled) {
      const toInstall = [];
      if (!isGmInstalled) toInstall.push('graphicsmagick');
      if (!isGsInstalled) toInstall.push('ghostscript');

      if (isNonInteractive()) {
        console.log(
          'Non-interactive environment detected. Proceeding with installation.',
        );
        const installCmd = `brew install ${toInstall.join(' ')}`;
        console.log(`\nExecuting: ${installCmd}\n`);
        exec(installCmd, error => {
          if (error) {
            console.error(`Error during installation: ${error.message}`);
          } else {
            console.log('Installation completed successfully.');
          }
        });
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Do you want to install ${toInstall.join(' and ')} using Homebrew? (y/n): `,
          async answer => {
            rl.close();
            if (answer.toLowerCase() === 'y') {
              const installCmd = `brew install ${toInstall.join(' ')}`;
              console.log(`\nExecuting: ${installCmd}\n`);
              exec(installCmd, error => {
                if (error) {
                  console.error(`Error during installation: ${error.message}`);
                } else {
                  console.log('Installation completed successfully.');
                }
              });
            } else {
              console.log('Installation aborted by the user.');
              showManualInstallationGuide();
            }
          },
        );
      }
    } else {
      console.log('Homebrew is not installed.\n');
      showManualInstallationGuide();
    }
  } else {
    console.log('GraphicsMagick and Ghostscript are already installed.\n');
  }
}

async function guideLinux() {
  console.log('Checking installation on Linux...\n');

  const isGmInstalled = await checkIfInstalled('gm', ['-version']);
  const isGsInstalled = await checkIfInstalled('gs', ['--version']);

  const packageManager = await detectPackageManager();

  if (!isGmInstalled || !isGsInstalled) {
    if (packageManager) {
      const toInstall = [];
      if (!isGmInstalled) toInstall.push('graphicsmagick');
      if (!isGsInstalled) toInstall.push('ghostscript');

      const sudoAvailable = await isSudoAvailable();
      const sudoCmd = sudoAvailable ? 'sudo ' : '';

      const installCommands = {
        'apt-get': `${sudoCmd}apt-get update && ${sudoCmd}apt-get install -y ${toInstall.join(' ')}`,
        yum: `${sudoCmd}yum install -y ${toInstall.join(' ')}`,
        dnf: `${sudoCmd}dnf install -y ${toInstall.join(' ')}`,
        pacman: `${sudoCmd}pacman -Sy --noconfirm ${toInstall.join(' ')}`,
        zypper: `${sudoCmd}zypper install -y ${toInstall.join(' ')}`,
      };

      if (isNonInteractive()) {
        console.log(
          'Non-interactive environment detected. Proceeding with installation.',
        );
        const installCmd = installCommands[packageManager];
        console.log(`\nExecuting: ${installCmd}\n`);
        exec(installCmd, error => {
          if (error) {
            console.error(`Error during installation: ${error.message}`);
            console.log(
              'Installation failed. Please install the packages manually.',
            );
            showManualInstallationGuide();
          } else {
            console.log('Installation completed successfully.');
          }
        });
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Do you want to install ${toInstall.join(' and ')} using ${packageManager}? (y/n): `,
          async answer => {
            rl.close();
            if (answer.toLowerCase() === 'y') {
              const installCmd = installCommands[packageManager];
              console.log(`\nExecuting: ${installCmd}\n`);
              exec(installCmd, error => {
                if (error) {
                  console.error(`Error during installation: ${error.message}`);
                } else {
                  console.log('Installation completed successfully.');
                }
              });
            } else {
              console.log('Installation aborted by the user.');
              showManualInstallationGuide();
            }
          },
        );
      }
    } else {
      console.log(
        'No supported package manager found. Please install the packages manually.',
      );
      showManualInstallationGuide();
    }
  } else {
    console.log('GraphicsMagick and Ghostscript are already installed.\n');
  }
}

function showManualInstallationGuide() {
  console.log('\nPlease install GraphicsMagick and Ghostscript manually:');
  console.log('GraphicsMagick: http://www.graphicsmagick.org/download.html');
  console.log('Ghostscript: https://www.ghostscript.com/download/gsdnld.html');
}

async function checkIfInstalled(command, args = []) {
  return new Promise(resolve => {
    exec(`${command} ${args.join(' ')}`, error => {
      resolve(!error);
    });
  });
}

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
