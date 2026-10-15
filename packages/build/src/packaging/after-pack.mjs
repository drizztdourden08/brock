/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ARCH_NAMES, MIB, UNUSED_ELECTRON_FILES, VELOPACK_BINDINGS, VELOPACK_NATIVE_DIR } from './packaging.constants.mjs';
import { rceditOptions } from './windows-version-info.mjs';

const removeAll = (paths) => {
  let freed = 0;
  for (const path of paths) {
    freed += statSync(path).size;
    rmSync(path);
  }
  return freed;
};

const report = (freed, what) => {
  if (freed) console.log(`  brock package: removed ${(freed / MIB).toFixed(1)} MB of ${what}`);
};

/**
 * @param {string} platform
 * @param {string} productFilename
 */
const resourcesDirOf = (platform, productFilename) =>
  (platform === 'darwin' ? join(`${productFilename}.app`, 'Contents', 'Resources') : 'resources');

/**
 * @param {{ appOutDir: string, platform: string, arch: string, resources: string }} target
 */
const pruneVelopackBindings = ({ appOutDir, platform, arch, resources }) => {
  const dir = join(appOutDir, resources, ...VELOPACK_NATIVE_DIR);
  if (!existsSync(dir)) return;
  const keep = VELOPACK_BINDINGS[`${platform}-${arch}`];
  if (!keep) throw new Error(`No Velopack binding is known for ${platform}-${arch}`);
  if (!existsSync(join(dir, keep))) throw new Error(`Velopack binding ${keep} is missing; the packaged app could not start`);
  const foreign = readdirSync(dir).filter((name) => name !== keep).map((name) => join(dir, name));
  report(removeAll(foreign), 'Velopack bindings for other platforms');
};

/**
 * @param {string} appOutDir
 */
const pruneElectronFiles = (appOutDir) => {
  const present = UNUSED_ELECTRON_FILES.map((name) => join(appOutDir, name)).filter((path) => existsSync(path));
  report(removeAll(present), 'unused Electron files');
};

/**
 * @param {string} exePath
 * @param {Parameters<typeof rceditOptions>[0]} stamp
 */
const stampExe = async (exePath, stamp) => {
  const { rcedit } = await import('rcedit');
  await rcedit(exePath, rceditOptions(stamp));
  console.log(`  brock package: ${stamp.icoPath ? 'icon and ' : ''}version info stamped on ${exePath}`);
};

/**
 * @param {string} rootDir
 * @param {string} hook the app's afterPack module, from rootDir
 * @param {import('electron-builder').AfterPackContext} context
 */
const runAppAfterPack = async (rootDir, hook, context) => {
  const file = resolve(rootDir, hook);
  if (!existsSync(file)) throw new Error(`brock.config.ts packaging.afterPack: ${hook} does not exist in the app folder`);
  const loaded = await import(pathToFileURL(file).href);
  const run = loaded.default ?? loaded.afterPack;
  if (typeof run !== 'function') throw new Error(`brock.config.ts packaging.afterPack: ${hook} exports no default function (or afterPack) to run`);
  await run(context);
};

/**
 * @param {import('electron-builder').AfterPackContext} context
 * @param {{ icoPath: string | null, versionStrings: Record<string, string> }} exe
 */
const brockAfterPack = async (context, { icoPath, versionStrings }) => {
  const { appOutDir, electronPlatformName: platform, packager } = context;
  const { productFilename } = packager.appInfo;
  const arch = ARCH_NAMES[context.arch] ?? String(context.arch);
  pruneVelopackBindings({ appOutDir, platform, arch, resources: resourcesDirOf(platform, productFilename) });
  if (platform !== 'win32') return;
  pruneElectronFiles(appOutDir);
  const exeName = `${productFilename}.exe`;
  const icon = icoPath && existsSync(icoPath) ? icoPath : null;
  await stampExe(join(appOutDir, exeName), { icoPath: icon, versionStrings, version: packager.appInfo.version, exeName });
};

/**
 * @param {string} rootDir
 * @param {{ ico?: string, versionStrings?: Record<string, string> }} exe icon (from rootDir), version strings
 * @param {string | null} [hook] the app's afterPack, run after Brock's
 * @returns {(context: import('electron-builder').AfterPackContext) => Promise<void>}
 */
const createAfterPack = (rootDir, { ico, versionStrings = {} }, hook = null) => async (context) => {
  await brockAfterPack(context, { icoPath: ico ? resolve(rootDir, ico) : null, versionStrings });
  if (hook) await runAppAfterPack(rootDir, hook, context);
};

export { createAfterPack };
