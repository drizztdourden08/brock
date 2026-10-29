/* @layer tooling-scripts @kind logic */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readManifest } from './read-entry.mjs';
import { KIND, MANIFEST_FILE } from './store.constants.mjs';

const foldersIn = (dir) => {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => join(dir, entry.name));
  } catch {
    return [];
  }
};

const foldersAt = (dirs) => dirs.flatMap(foldersIn);

/**
 * @param {string} root the cache root
 * @returns {{ dir: string, manifest: Record<string, any> | null }[]} each entry folder and its manifest
 */
const listEntries = (root) => {
  const kinds = Object.values(KIND).map((kind) => join(root, kind));
  return foldersAt(foldersAt(foldersAt(kinds))).map((dir) => ({ dir, manifest: readManifest(join(dir, MANIFEST_FILE)) }));
};

export { listEntries };
