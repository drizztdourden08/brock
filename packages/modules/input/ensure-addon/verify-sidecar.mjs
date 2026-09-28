/* @layer tooling-scripts @kind logic */
import { basename } from 'node:path';
import { sha256File } from './sha256-file.mjs';

const MISMATCH = 'checksum mismatch';

/**
 * @param {string} url the archive url; the digest sits at url.sha256
 * @param {string} archive local copy of the archive
 * @param {(message: string) => void} log
 * @returns {Promise<void>} rejects only on a digest mismatch
 */
const verifySidecar = async (url, archive, log) => {
  const name = basename(archive);
  try {
    const sidecar = await fetch(`${url}.sha256`);
    if (!sidecar.ok) {
      log(`No .sha256 beside ${name}; installing it unverified.`);
      return;
    }
    const expected = (await sidecar.text()).trim().split(/\s+/)[0];
    const actual = sha256File(archive);
    if (expected && actual !== expected) throw new Error(`${MISMATCH} for ${name} (expected ${expected}, got ${actual})`);
  } catch (err) {
    if (err instanceof Error && err.message.startsWith(MISMATCH)) throw err;
    log(`Could not verify ${name}: ${err instanceof Error ? err.message : String(err)}; installing it unverified.`);
  }
};

export { verifySidecar };
