/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { SCRIPT_FILES, SHARE_PREFIX } from './linux.constants.mjs';
import { copyTo, remoteCapture, runRemoteScript, scriptText, shellQuote } from './remote.mjs';
import { addTransientShare } from './vbox.mjs';

/**
 * @typedef {import('./remote.mjs').RemoteTarget} RemoteTarget
 * @typedef {import('./linux-machine.mjs').LinuxMachine} LinuxMachine
 * @typedef {import('./linux-settings.mjs').LinuxSettings} LinuxSettings
 */

/**
 * @param {string} hostPath a Windows path
 * @returns {string} the same folder as WSL mounts it
 */
const wslMountPath = (hostPath) => {
  const match = /^([A-Za-z]):[\\/]?(.*)$/.exec(hostPath);
  if (!match) throw new Error(`${hostPath} is not on a drive WSL mounts.`);
  return `/mnt/${match[1].toLowerCase()}/${match[2].replace(/\\/g, '/')}`.replace(/\/$/, '');
};

/**
 * @param {string} folder a folder under the VM user's home
 * @param {string} share the VirtualBox share name
 * @returns {string} one shell line that mounts it unless it is mounted
 */
const mountLine = (folder, share) => {
  const target = `"$HOME"/${shellQuote(folder)}`;
  return `mkdir -p ${target} && (mountpoint -q ${target} || sudo -n mount -t vboxsf -o uid=$(id -u),gid=$(id -g) ${shellQuote(share)} ${target})`;
};

/**
 * @param {RemoteTarget} remote
 * @param {LinuxMachine} machine
 * @param {{ name: string, hostPath: string, folder: string }} share
 */
const mountShare = (remote, machine, share) => {
  addTransientShare(machine.vmName, share.name, share.hostPath);
  try {
    remoteCapture(remote, mountLine(share.folder, share.name));
  } catch (error) {
    throw new Error(`The VM could not mount the share ${share.name} at ~/${share.folder}: ${error.stderr?.toString().trim() || error.message}\nThe mount runs sudo -n: give ${machine.user} passwordless sudo for mount -t vboxsf, or mount the share at boot (fstab), and install the Guest Additions.`, { cause: error });
  }
};

const buildArgs = (settings, source, staged) => [source, settings.repoName, settings.appDir, settings.artifactDir, staged, ...settings.build];

/**
 * @param {RemoteTarget} remote
 * @param {LinuxMachine} machine
 * @param {LinuxSettings} settings
 * @param {{ checkout: string, staged: string, log: (message: string) => void }} run
 */
const buildInVm = (remote, machine, settings, run) => {
  const source = `${settings.repoName}-src`;
  run.log(`Sharing ${run.checkout} with ${machine.vmName} as ~/${source}`);
  mountShare(remote, machine, { name: `${SHARE_PREFIX}${settings.repoName}-src`, hostPath: run.checkout, folder: source });
  run.log(`Building ${settings.appDir} in the VM: ${settings.build.join(' ')}`);
  runRemoteScript(remote, SCRIPT_FILES.build, buildArgs(settings, source, run.staged));
};

/**
 * @param {RemoteTarget} remote
 * @param {LinuxMachine} machine
 * @param {LinuxSettings} settings
 * @param {{ checkout: string, staged: string, log: (message: string) => void }} run
 */
const buildInWsl = (remote, machine, settings, run) => {
  const built = `${settings.repoName}-out/${settings.product.id}.AppImage`;
  run.log(`Building ${settings.appDir} in WSL (${machine.wslDistro}): ${settings.build.join(' ')}`);
  execFileSync('wsl', ['-d', machine.wslDistro, '-e', 'bash', '-c', `mkdir -p "$HOME/${settings.repoName}-out"`], { stdio: 'inherit' });
  execFileSync('wsl', ['-d', machine.wslDistro, '-e', 'bash', '-s', '--', ...buildArgs(settings, wslMountPath(run.checkout), built)], { input: scriptText(SCRIPT_FILES.build), stdio: ['pipe', 'inherit', 'inherit'] });
  const hostCopy = execFileSync('wsl', ['-d', machine.wslDistro, '-e', 'bash', '-c', `wslpath -w "$HOME/${built}"`], { encoding: 'utf8' }).trim();
  run.log(`Copying the AppImage into ${machine.vmName}`);
  copyTo(remote, hostCopy, run.staged);
};

export { wslMountPath, mountLine, mountShare, buildInVm, buildInWsl };
