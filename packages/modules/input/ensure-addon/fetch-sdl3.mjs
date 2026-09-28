/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LIBUSB_HINT } from './addon.constants.mjs';
import { fetchLibusbWindows } from './fetch-libusb-windows.mjs';
import { fetchSdl3Source } from './fetch-sdl3-source.mjs';
import { readJson } from './read-json.mjs';

const hasSystemLibusb = () => {
  try {
    execFileSync('pkg-config', ['--exists', 'libusb-1.0'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const isFetched = ({ paths, pins }, markerFile) => {
  const marker = readJson(markerFile);
  return Boolean(marker)
    && marker.sdl3Version === pins.sdl3Version
    && marker.libusbVersion === pins.libusbVersion
    && marker.platform === process.platform
    && marker.artifacts.every((path) => existsSync(path))
    && existsSync(paths.thirdPartyDir);
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<void>}
 */
const fetchSdl3 = async (job) => {
  const { paths, pins, force, log } = job;
  const markerFile = join(paths.thirdPartyDir, '.fetched.json');
  if (!force && isFetched(job, markerFile)) return;
  log(`Fetching SDL ${pins.sdl3Version} and libusb ${pins.libusbVersion} for ${process.platform}.`);
  const artifacts = [await fetchSdl3Source(job)];
  if (process.platform === 'win32') artifacts.push(await fetchLibusbWindows(job));
  else if (!hasSystemLibusb()) log(`libusb-1.0 is not installed, so SDL builds without it: ${LIBUSB_HINT[process.platform] ?? 'install libusb-1.0 and pkg-config'}`);
  mkdirSync(paths.thirdPartyDir, { recursive: true });
  const marker = { sdl3Version: pins.sdl3Version, libusbVersion: pins.libusbVersion, platform: process.platform, artifacts, fetchedAt: new Date().toISOString() };
  writeFileSync(markerFile, `${JSON.stringify(marker, null, 2)}\n`);
};

export { fetchSdl3 };
