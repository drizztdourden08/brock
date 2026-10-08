/* @layer tooling-scripts @kind constants */
const LINUX_CONFIG_FOLDER = ['.brock', 'linux'];
const LINUX_CONFIG_ENV = 'BROCK_LINUX_CONFIG';
const VBOXMANAGE_ENV = 'VBOXMANAGE';

const VBOXMANAGE_DEFAULTS = Object.freeze({
  win32: 'C:\\Program Files\\Oracle\\VirtualBox\\VBoxManage.exe',
  default: 'VBoxManage',
});

const BUILDERS = Object.freeze(['vm', 'wsl']);

const MACHINE_DEFAULTS = Object.freeze({ builder: 'vm', wslDistro: 'Ubuntu-24.04' });

const SECRET_KEY = /pass(word|phrase)?|secret|token|credential/i;

const REPO_DEFAULTS = Object.freeze({
  build: ['pnpm', 'exec', 'brock', 'package'],
  artifactDir: 'release/velopack',
  launchFlags: ['--muted'],
});

const SHARE_PREFIX = 'brock-';

const SSH_OPTIONS = Object.freeze(['-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=10']);

const SCRIPTS_DIR = new URL('./scripts/', import.meta.url);

const SCRIPT_FILES = Object.freeze({
  build: 'build-linux.sh',
  install: 'install-desktop.sh',
  launch: 'launch-app.sh',
  setup: 'setup-vm.sh',
});

const LINUX_USAGE = [
  '  brock linux push [--build-only]          build the Linux app in the VM (or in WSL), install its desktop entry',
  '                                           and launch it in the VirtualBox VM this machine names',
  '  brock linux doctor                       check WSL, VirtualBox, the VM and key-only SSH access to it',
  '  brock linux init                         write this machine\'s VM settings file (never a password) and',
  '                                           print the one-time VM setup and key steps',
].join('\n');

export {
  LINUX_CONFIG_FOLDER, LINUX_CONFIG_ENV, VBOXMANAGE_ENV, VBOXMANAGE_DEFAULTS, BUILDERS, MACHINE_DEFAULTS, SECRET_KEY, REPO_DEFAULTS,
  SHARE_PREFIX, SSH_OPTIONS, SCRIPTS_DIR, SCRIPT_FILES, LINUX_USAGE,
};
