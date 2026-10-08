/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { remoteCapture } from './remote.mjs';
import { vboxManagePath, vmState } from './vbox.mjs';

/**
 * @typedef {{ label: string, ok: boolean, detail: string, hint?: string }} LinuxCheck
 */

const TOOLS = ['node', 'pnpm', 'rsync', 'vpk'];
const TOOLS_LINE = `export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"; export PATH="$HOME/.dotnet/tools:$PATH"; for t in ${TOOLS.join(' ')}; do command -v $t >/dev/null 2>&1 || echo $t; done`;

const quiet = (file, args) => execFileSync(file, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const firstLine = (text) => text.trim().split('\n')[0] ?? '';

/**
 * @param {string} text the output of wsl -l -q, UTF-16 on Windows
 * @returns {string[]} the distro names
 */
const wslDistros = (text) => text.replace(/\0/g, '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const probe = (label, run, hint) => {
  try {
    return { label, ok: true, detail: run() };
  } catch (error) {
    return { label, ok: false, detail: firstLine(error.stderr?.toString() || error.message), hint };
  }
};

const sshClient = () => probe('ssh client', () => firstLine(execFileSync('ssh', ['-V'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) || 'found'), 'Install the OpenSSH client (Windows: Settings > Optional features > OpenSSH Client).');

const virtualBox = () => probe('VirtualBox', () => `VBoxManage ${firstLine(quiet(vboxManagePath(), ['--version']))}`, 'Install VirtualBox, or set VBOXMANAGE to VBoxManage\'s path.');

const vmCheck = (machine) => {
  const state = vmState(machine.vmName);
  if (state === null) return { label: 'VM', ok: false, detail: `no VM named "${machine.vmName}"`, hint: `Set vmName in ${machine.file} to a name VBoxManage list vms shows.` };
  return { label: 'VM', ok: state === 'running', detail: `${machine.vmName} is ${state}`, hint: 'Start the VM and log in to its desktop.' };
};

const sshAccess = (remote, machine) => probe('key access', () => `${remote.target}: ${remoteCapture(remote, 'uname -sr')}`, `Authorize your public key on the VM once (${machine.user}'s ~/.ssh/authorized_keys); the push never asks for or stores a password.`);

const missingOf = (text) => text.split(/\s+/).filter(Boolean);

const toolsResult = (label, missing, hint) => (missing.length
  ? { label, ok: false, detail: `missing ${missing.join(', ')}`, hint }
  : { label, ok: true, detail: TOOLS.join(', ') });

const vmTools = (remote) => {
  try {
    return toolsResult('VM build tools', missingOf(remoteCapture(remote, TOOLS_LINE)), 'Run setup-vm.sh on the VM once (linux init prints how).');
  } catch (error) {
    return { label: 'VM build tools', ok: false, detail: firstLine(error.message) };
  }
};

const vmShares = (remote) => probe('shared folders', () => {
  remoteCapture(remote, 'command -v mount.vboxsf >/dev/null || test -x /sbin/mount.vboxsf');
  return 'mount.vboxsf found';
}, 'Install the VirtualBox Guest Additions in the VM.');

const wslCheck = (machine) => {
  const found = probe('WSL', () => wslDistros(quiet('wsl', ['-l', '-q'])).join(', '), 'Install WSL: wsl --install -d Ubuntu-24.04');
  if (!found.ok) return [found];
  const has = found.detail.split(', ').includes(machine.wslDistro);
  if (!has) return [{ label: 'WSL', ok: false, detail: `no distro ${machine.wslDistro} (have ${found.detail || 'none'})`, hint: `wsl --install -d ${machine.wslDistro}, or set wslDistro.` }];
  const tools = probe('WSL build tools', () => quiet('wsl', ['-d', machine.wslDistro, '-e', 'bash', '-c', TOOLS_LINE]), '');
  const missing = tools.ok ? missingOf(tools.detail) : TOOLS;
  return [{ label: 'WSL', ok: true, detail: machine.wslDistro }, toolsResult('WSL build tools', missing, 'Run setup-vm.sh inside the WSL distro once.')];
};

/**
 * @param {import('./linux-machine.mjs').LinuxMachine} machine
 * @param {import('./remote.mjs').RemoteTarget} remote
 * @returns {LinuxCheck[]}
 */
const linuxChecks = (machine, remote) => {
  const vm = vmCheck(machine);
  const base = [sshClient(), virtualBox(), vm];
  const access = vm.ok ? sshAccess(remote, machine) : { label: 'key access', ok: false, detail: 'not checked while the VM is off' };
  const inside = access.ok ? [access, vmShares(remote), ...(machine.builder === 'vm' ? [vmTools(remote)] : [])] : [access];
  const wsl = machine.builder === 'wsl' ? wslCheck(machine) : [];
  return [...base, ...inside, ...wsl];
};

export { linuxChecks, wslDistros };
