/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { WIN_ARCH } from './addon.constants.mjs';
import { downloadVerified } from './download-verified.mjs';
import { extractSevenZip } from './extract-seven-zip.mjs';

const MARKER_NAME = '.brock-libusb-version';

const hasLibusb = (libusbDir, version) => {
  const marker = join(libusbDir, MARKER_NAME);
  const stamped = existsSync(marker) && readFileSync(marker, 'utf8').trim() === version;
  const droppedIn = existsSync(join(libusbDir, 'include', 'libusb.h'));
  return (stamped || droppedIn) && existsSync(join(libusbDir, WIN_ARCH[process.arch].libusbDir, 'dll', 'libusb-1.0.lib'));
};

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<string>} the unpacked libusb folder
 */
const fetchLibusbWindows = async (job) => {
  const { libusbVersion } = job.pins;
  const libusbDir = join(job.paths.thirdPartyDir, `libusb-${libusbVersion}`);
  if (hasLibusb(libusbDir, libusbVersion)) {
    job.log(`libusb ${libusbVersion} is already in ${libusbDir}; skipping the download.`);
    return libusbDir;
  }
  const name = `libusb-${libusbVersion}.7z`;
  const archive = await downloadVerified(`https://github.com/libusb/libusb/releases/download/v${libusbVersion}/${name}`, name, job);
  extractSevenZip(archive, libusbDir, `unpack ${name} yourself into ${libusbDir} (it must hold include and ${WIN_ARCH[process.arch].libusbDir}).`);
  writeFileSync(join(libusbDir, MARKER_NAME), `${libusbVersion}\n`);
  return libusbDir;
};

export { fetchLibusbWindows };
