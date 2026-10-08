/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { VBOXMANAGE_DEFAULTS, VBOXMANAGE_ENV } from './linux.constants.mjs';

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
const vboxManagePath = (env = process.env) => env[VBOXMANAGE_ENV] ?? VBOXMANAGE_DEFAULTS[process.platform] ?? VBOXMANAGE_DEFAULTS.default;

/**
 * @param {string} text the output of showvminfo --machinereadable
 * @returns {string | null} running, poweroff, saved, ...
 */
const vmStateOf = (text) => /^VMState="([^"]+)"/m.exec(text)?.[1] ?? null;

/**
 * @param {string} vmName
 * @returns {string | null} the VM's state, or null when VirtualBox does not know it
 */
const vmState = (vmName) => {
  try {
    return vmStateOf(execFileSync(vboxManagePath(), ['showvminfo', vmName, '--machinereadable'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return null;
  }
};

/**
 * @param {string} vmName
 * @param {string} name the share name
 * @param {string} hostPath
 */
const addTransientShare = (vmName, name, hostPath) => {
  mkdirSync(hostPath, { recursive: true });
  try {
    execFileSync(vboxManagePath(), ['sharedfolder', 'add', vmName, '--name', name, '--hostpath', hostPath, '--transient'], { stdio: 'ignore' });
  } catch {
    return false;
  }
  return true;
};

export { vboxManagePath, vmStateOf, vmState, addTransientShare };
