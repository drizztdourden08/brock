/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';

/**
 * @param {string[]} files the pre-bundled files and manifests
 * @returns {string} a hash of their paths, times and sizes
 */
const linkedSourcesStamp = (files) => {
  const hash = createHash('sha1');
  for (const file of [...files].sort()) {
    const stat = statSync(file, { throwIfNoEntry: false });
    hash.update(`${file}\0${stat ? `${stat.mtimeMs}\0${stat.size}` : 'missing'}\n`);
  }
  return hash.digest('hex').slice(0, 16);
};

export { linkedSourcesStamp };
