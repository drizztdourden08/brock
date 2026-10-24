/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { findSevenZip } from './find-seven-zip.mjs';

/**
 * @param {string} archive a .7z
 * @param {string} destination
 * @param {string} dropHint what to tell the user when 7-Zip is missing
 * @returns {void}
 */
const extractSevenZip = (archive, destination, dropHint) => {
  const sevenZip = findSevenZip();
  if (!sevenZip) throw new Error(`7-Zip is required to unpack ${archive} and was not found on PATH or in Program Files. Install 7-Zip (https://www.7-zip.org), or ${dropHint}`);
  mkdirSync(destination, { recursive: true });
  execFileSync(sevenZip, ['x', archive, `-o${destination}`, '-y'], { stdio: 'inherit' });
};

export { extractSevenZip };
