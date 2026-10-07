/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TESSERA_PACKAGE } from '../upgrade/tessera/tessera-renames.constants.mjs';

const readManifest = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
};

const listsTessera = (manifest) => [manifest?.dependencies, manifest?.devDependencies, manifest?.peerDependencies].some((deps) => Boolean(deps?.[TESSERA_PACKAGE]));

/**
 * @param {string} dir  a package folder
 * @returns {boolean}  it lists or holds Tessera
 */
const hasTessera = (dir) => listsTessera(readManifest(dir)) || existsSync(join(dir, 'node_modules', ...TESSERA_PACKAGE.split('/'), 'package.json'));

export { hasTessera };
