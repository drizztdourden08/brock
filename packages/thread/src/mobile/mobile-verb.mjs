/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { mobileConfig } from './mobile-config.mjs';

const IS_WINDOWS = process.platform === 'win32';
const USAGE = '  brock mobile push            web build, cap sync, gradle, adb install and start on the online device';

const adbPath = () => {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? '';
  const name = IS_WINDOWS ? 'adb.exe' : 'adb';
  return sdk ? join(sdk, 'platform-tools', name) : name;
};

const capture = (file, args) => execFileSync(file, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const runStep = (file, args, cwd, viaShell = false) => {
  execFileSync(file, args, { cwd, stdio: 'inherit', shell: viaShell && IS_WINDOWS });
};

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

const buildApk = (config, ctx) => {
  ctx.log(`Web build: ${config.webBuild.join(' ')}`);
  runStep(config.webBuild[0], config.webBuild.slice(1), ctx.rootDir, true);
  ctx.log(`Capacitor sync: ${config.syncCommand.join(' ')}`);
  runStep(config.syncCommand[0], config.syncCommand.slice(1), config.dir, true);
  const gradlew = IS_WINDOWS ? 'gradlew.bat' : './gradlew';
  if (!existsSync(join(config.androidDir, gradlew.replace('./', '')))) throw new Error(`${config.androidDir} has no Gradle wrapper. Run cap add android first.`);
  ctx.log(`Gradle: ${config.gradleTask}`);
  runStep(gradlew, [config.gradleTask], config.androidDir, true);
  if (!existsSync(config.apk)) throw new Error(`Gradle finished but ${config.apk} is missing.`);
};

const installAndStart = (adb, serial, config, ctx) => {
  ctx.log(`Installing on ${serial}...`);
  runStep(adb, ['-s', serial, 'install', '-r', config.apk]);
  runStep(adb, ['-s', serial, 'shell', 'am', 'force-stop', config.packageId]);
  runStep(adb, ['-s', serial, 'shell', 'am', 'start', '-a', 'android.intent.action.MAIN', '-c', 'android.intent.category.LAUNCHER', '-p', config.packageId]);
  ctx.log(`Installed and started ${config.packageId} on ${serial}.`);
};

const push = (ctx) => {
  const config = mobileConfig(ctx.rootDir, ctx.workspace);
  const adb = adbPath();
  assertAdb(adb);
  const serial = onlineDevice(adb);
  buildApk(config, ctx);
  installAndStart(adb, serial, config, ctx);
};

const SUB_VERBS = { push };

const run = async (positional, options, ctx) => {
  const [sub] = positional;
  const handler = SUB_VERBS[sub];
  if (!handler) throw new Error(`Unknown mobile verb "${sub ?? ''}".\n\n${USAGE}`);
  handler(ctx);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const mobileVerb = { usage: USAGE, run, asks: false };

export { mobileVerb };
