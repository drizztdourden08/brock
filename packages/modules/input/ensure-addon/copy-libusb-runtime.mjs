/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, realpathSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { LIBUSB_RUNTIME_NAME, WIN_ARCH } from './addon.constants.mjs';

const copyWindows = ({ paths, pins }) => {
  const source = join(paths.thirdPartyDir, `libusb-${pins.libusbVersion}`, WIN_ARCH[process.arch].libusbDir, 'dll', 'libusb-1.0.dll');
  const binDir = join(paths.installDir, 'bin');
  mkdirSync(binDir, { recursive: true });
  copyFileSync(source, join(binDir, 'libusb-1.0.dll'));
};

const systemLibdir = () => {
  try {
    return execFileSync('pkg-config', ['--variable=libdir', 'libusb-1.0'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {void}
 */
const copyLibusbRuntime = (job) => {
  if (process.platform === 'win32') {
    copyWindows(job);
    return;
  }
  const name = LIBUSB_RUNTIME_NAME[process.platform];
  const libdir = name ? systemLibdir() : null;
  const source = libdir ? join(libdir, name) : null;
  if (!source || !existsSync(source)) {
    job.log('pkg-config found no libusb-1.0 runtime, so libusb does not ship beside the addon.');
    return;
  }
  const libDir = join(job.paths.installDir, 'lib');
  mkdirSync(libDir, { recursive: true });
  const destination = join(libDir, name);
  rmSync(destination, { force: true });
  copyFileSync(realpathSync(source), destination);
  chmodSync(destination, 0o644);
};

export { copyLibusbRuntime };
