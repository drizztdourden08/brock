/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { FILES_DIR, KIND, MANIFEST_FILE, SEGMENT } from './store.constants.mjs';

/**
 * @param {string} name a package name, scoped or not
 * @returns {string} the name as one folder: the scope slash becomes +
 */
const folderOfName = (name) => name.replace('/', '+');

const checked = (label, value) => {
  if (typeof value !== 'string' || !SEGMENT.test(value) || value === '.' || value === '..') throw new Error(`build-cache: ${label} "${value}" cannot name a cache folder`);
  return value;
};

/**
 * @typedef {{ root: string, kind: string, name: string, version: string, buildKey: string }} EntryId
 */

/**
 * @param {EntryId} id
 * @returns {{ dir: string, filesDir: string, manifestFile: string }} where the entry lives
 */
const entryPaths = ({ root, kind, name, version, buildKey }) => {
  if (!Object.values(KIND).includes(kind)) throw new Error(`build-cache: unknown kind "${kind}"`);
  const dir = join(root, kind, checked('name', folderOfName(name)), checked('version', version), checked('build key', buildKey));
  return { dir, filesDir: join(dir, FILES_DIR), manifestFile: join(dir, MANIFEST_FILE) };
};

export { entryPaths };
