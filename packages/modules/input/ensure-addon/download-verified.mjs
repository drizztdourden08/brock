/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SDL3_CHECKSUMS } from './addon.constants.mjs';
import { downloadFile } from './download-file.mjs';
import { sha256File } from './sha256-file.mjs';

/**
 * @param {string} url
 * @param {string} filename a key of SDL3_CHECKSUMS
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {Promise<string>} the verified local file
 */
const downloadVerified = async (url, filename, { paths, force, log }) => {
  const destination = join(paths.downloadsDir, filename);
  if (force || !existsSync(destination)) {
    log(`Downloading ${url}`);
    await downloadFile(url, destination);
  }
  const actual = sha256File(destination);
  const expected = SDL3_CHECKSUMS[filename];
  if (!expected) {
    log(`No pinned checksum for ${filename}; using it unverified. Its SHA-256 is ${actual}, add it to SDL3_CHECKSUMS.`);
    return destination;
  }
  if (actual !== expected) throw new Error(`Checksum mismatch for ${filename} (expected ${expected}, got ${actual}). Delete ${paths.downloadsDir} and retry.`);
  return destination;
};

export { downloadVerified };
