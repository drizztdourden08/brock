/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { checkoutRoot } from '../ports/checkout-root.mjs';
import { buildInVm, buildInWsl, mountShare } from './build-steps.mjs';
import { SCRIPT_FILES, SHARE_PREFIX } from './linux.constants.mjs';
import { loadMachine } from './linux-machine.mjs';
import { linuxSettings } from './linux-settings.mjs';
import { disposeKey, privateKeyPath } from './private-key.mjs';
import { copyTo, remoteCapture, remoteTarget, runRemoteScript } from './remote.mjs';
import { vmState } from './vbox.mjs';

const ICON_DIR = '.local/share/icons';

const assertRunning = (machine) => {
  const state = vmState(machine.vmName);
  if (state === null) throw new Error(`VirtualBox has no VM named "${machine.vmName}" (vmName in ${machine.file}).`);
  if (state !== 'running') throw new Error(`The VM "${machine.vmName}" is ${state}. Start it and log in to its desktop, then run again.`);
};

const installAndLaunch = (remote, machine, settings, ctx) => {
  const { id, name } = settings.product;
  const appImage = `${id}.AppImage`;
  for (const share of settings.shares) {
    ctx.log(`Mounting ${share.path} at ~/${share.name}`);
    mountShare(remote, machine, { name: `${SHARE_PREFIX}${share.name}`, hostPath: resolve(ctx.rootDir, share.path), folder: share.name });
  }
  const icon = `${ICON_DIR}/${id}.png`;
  if (settings.icon) {
    remoteCapture(remote, `mkdir -p "$HOME/${ICON_DIR}"`);
    copyTo(remote, settings.icon, icon);
  }
  ctx.log('Installing the desktop entry...');
  runRemoteScript(remote, SCRIPT_FILES.install, [appImage, id, name, icon]);
  ctx.log('Launching on the VM...');
  runRemoteScript(remote, SCRIPT_FILES.launch, [appImage, id, ...settings.launchFlags]);
  ctx.log(`Pushed and launched ${name} on ${machine.vmName}.`);
};

/**
 * @param {Record<string, string | boolean>} options build-only
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 */
const linuxPush = async (options, ctx) => {
  const machine = loadMachine(ctx.workspace.name);
  const settings = await linuxSettings(ctx.rootDir, ctx.workspace);
  assertRunning(machine);
  const key = privateKeyPath(machine);
  try {
    const remote = remoteTarget(machine, key);
    const run = { checkout: checkoutRoot(process.cwd()) ?? ctx.rootDir, staged: `${settings.product.id}.AppImage.incoming`, log: ctx.log };
    if (machine.builder === 'wsl') buildInWsl(remote, machine, settings, run);
    else buildInVm(remote, machine, settings, run);
    if (flag(options, 'build-only')) {
      ctx.log(`Built. The AppImage waits at ~/${run.staged} on the VM.`);
      return;
    }
    installAndLaunch(remote, machine, settings, ctx);
  } finally {
    disposeKey(machine, key);
  }
};

export { linuxPush };
