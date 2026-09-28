/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {string} manifestUrl import.meta.resolve of a dependency's package.json
 * @returns {{ dir: string, version: string }}
 */
const ownPackage = (manifestUrl) => {
  const manifest = fileURLToPath(manifestUrl);
  return { dir: dirname(manifest), version: JSON.parse(readFileSync(manifest, 'utf8')).version };
};

export { ownPackage };
