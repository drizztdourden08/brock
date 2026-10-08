/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MACHINE_DEFAULTS, SCRIPT_FILES, SCRIPTS_DIR } from './linux.constants.mjs';
import { machineFile } from './linux-machine.mjs';

/**
 * @param {string} workspaceName
 * @returns {Record<string, unknown>} the settings to fill in; no password field exists
 */
const machineTemplate = (workspaceName) => ({
  vmName: `${workspaceName}-linux`,
  host: '192.168.56.50',
  user: 'you',
  port: 22,
  identityFile: '',
  builder: MACHINE_DEFAULTS.builder,
  wslDistro: MACHINE_DEFAULTS.wslDistro,
});

const keyStep = (host) => (process.platform === 'win32'
  ? `type $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh you@${host} "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"`
  : `ssh-copy-id you@${host}`);

/**
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 */
const linuxInit = (ctx) => {
  const file = machineFile(ctx.workspace.name);
  if (existsSync(file)) ctx.log(`This machine's VM settings: ${file} (left as they are).`);
  else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `${JSON.stringify(machineTemplate(ctx.workspace.name), null, 2)}\n`, 'utf8');
    ctx.log(`Wrote ${file}. Fill in vmName, host, user and identityFile (empty uses the ssh agent and the default keys).`);
  }
  const setup = fileURLToPath(new URL(SCRIPT_FILES.setup, SCRIPTS_DIR));
  ctx.log('Once per VM, yourself:');
  console.log(`  1. Copy ${setup} into the VM and run it there: bash setup-vm.sh`);
  console.log('  2. Give the VM a host-only adapter with a fixed address, and install the Guest Additions.');
  console.log(`  3. Authorize your key (ssh asks for the VM password this one time, Brock never does): ${keyStep('<host>')}`);
  console.log(`  4. Check it: ${ctx.workspace.name} linux doctor`);
};

export { linuxInit, machineTemplate };
