/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { downloadVerified } from './download-verified.mjs';
import { extractArchive } from './extract-archive.mjs';

/**
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<string>} the unpacked libusb folder
 */
const fetchLibusbWindows = async (job) => {
  const { libusbVersion } = job.pins;
  const name = `libusb-${libusbVersion}.7z`;
  const archive = await downloadVerified(`https://github.com/libusb/libusb/releases/download/v${libusbVersion}/${name}`, name, job);
  const libusbDir = join(job.paths.thirdPartyDir, `libusb-${libusbVersion}`);
  if (!extractArchive(archive, libusbDir)) {
    throw new Error(`tar could not unpack ${archive}. Install 7-Zip and run: 7z x "${archive}" -o"${libusbDir}"`);
  }
  return libusbDir;
};

export { fetchLibusbWindows };
