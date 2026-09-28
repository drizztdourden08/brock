/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ARCH_NAMES, MIB, UNUSED_ELECTRON_FILES, VELOPACK_BINDINGS, VELOPACK_NATIVE_DIR } from './packaging.constants.mjs';

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
 * @param {string} icoPath
 */
const stampIcon = async (exePath, icoPath) => {
  const { rcedit } = await import('rcedit');
  await rcedit(exePath, { icon: icoPath });
  console.log(`  brock package: icon stamped on ${exePath}`);
};

/**
 * @param {string} rootDir
 * @param {string | undefined} ico the Windows icon, relative to rootDir
 * @returns {(context: import('electron-builder').AfterPackContext) => Promise<void>}
 */
const createAfterPack = (rootDir, ico) => async (context) => {
  const icoPath = ico ? resolve(rootDir, ico) : null;
  const { appOutDir, electronPlatformName: platform, packager } = context;
  const { productFilename } = packager.appInfo;
  const arch = ARCH_NAMES[context.arch] ?? String(context.arch);
  pruneVelopackBindings({ appOutDir, platform, arch, resources: resourcesDirOf(platform, productFilename) });
  if (platform !== 'win32') return;
  pruneElectronFiles(appOutDir);
  if (icoPath && existsSync(icoPath)) await stampIcon(join(appOutDir, `${productFilename}.exe`), icoPath);
};

export { createAfterPack };
