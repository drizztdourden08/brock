/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { buildApk } from './build-apk.mjs';
import { mobileConfig } from './mobile-config.mjs';
import { runStep } from './run-step.mjs';

const adbPath = () => {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? '';
  const name = process.platform === 'win32' ? 'adb.exe' : 'adb';
  return sdk ? join(sdk, 'platform-tools', name) : name;
};

const capture = (file, args) => execFileSync(file, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const assertAdb = (adb) => {
  try {
    capture(adb, ['version']);
  } catch {
    throw new Error('adb was not found. Install the Android SDK platform tools and set ANDROID_HOME.');
  }
};

const onlineDevice = (adb) => {
  const online = capture(adb, ['devices'])
    .split('\n')
    .slice(1)
    .filter((line) => line.trim().endsWith('\tdevice'))
    .map((line) => line.split(/\s+/)[0]);
  const preferred = process.env.ANDROID_SERIAL;
  if (preferred && online.includes(preferred)) return preferred;
  if (online.length === 0) throw new Error('No Android device is online. Start an emulator or plug in a device with USB debugging, then run again.');
  return online[0];
};

const installAndStart = (adb, serial, config, ctx) => {
  ctx.log(`Installing on ${serial}...`);
  runStep(adb, ['-s', serial, 'install', '-r', config.apk]);
  runStep(adb, ['-s', serial, 'shell', 'am', 'force-stop', config.packageId]);
  runStep(adb, ['-s', serial, 'shell', 'am', 'start', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.LAUNCHER', '-p', config.packageId]);
  ctx.log(`Installed and started ${config.packageId} on ${serial}.`);
};

/**
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 */
const mobilePush = (ctx) => {
  const config = mobileConfig(ctx.rootDir, ctx.workspace);
  const adb = adbPath();
  assertAdb(adb);
  const serial = onlineDevice(adb);
  buildApk(config, ctx);
  installAndStart(adb, serial, config, ctx);
};

export { mobilePush };
