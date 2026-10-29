/* @layer tooling-scripts @kind logic */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { commitEntry } from '../store/commit-entry.mjs';
import { hashTree } from '../store/hash-tree.mjs';
import { readEntry, touchEntry } from '../store/read-entry.mjs';
import { KIND } from '../store/store.constants.mjs';
import { compilePackage } from './compile-package.mjs';
import { PLACED_FOLDER, PLACED_MARKER } from './packages.constants.mjs';

/**
 * @param {string} rootDir the app root
 * @param {string} name a package name
 * @returns {string} where the app gets its compiled copy of the package
 */
const placedDirOf = (rootDir, name) => join(rootDir, ...PLACED_FOLDER, ...name.split('/'));

const placedHash = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, PLACED_MARKER), 'utf8')).contentHash ?? null;
  } catch {
    return null;
  }
};

const place = (entry, target) => {
  if (placedHash(target) === entry.manifest.contentHash && existsSync(join(target, 'package.json'))) return;
  rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(entry.filesDir, target, { recursive: true });
  writeFileSync(join(target, PLACED_MARKER), `${JSON.stringify({ contentHash: entry.manifest.contentHash, from: entry.dir })}\n`);
};

/**
 * @param {{ root: string, rootDir: string, source: import('./package-closure.mjs').ScopedPackage, settings: Record<string, unknown>, buildKey: string }} input
 * @returns {Promise<{ placedDir: string, imports: Record<string, string[]>, built: boolean }>} imports: the runtime packages of each export key
 */
const servePackage = async ({ root, rootDir, source, settings, buildKey }) => {
  const id = { root, kind: KIND.PACKAGE, name: source.name, version: source.version, buildKey };
  const { contentHash: inputHash } = hashTree(source.dir);
  let entry = readEntry(id, { inputHash });
  const built = !entry;
  if (!entry) entry = await commitEntry({ ...id, inputHash, buildSettings: settings, fill: (filesDir) => compilePackage(source, settings, filesDir) });
  touchEntry(entry);
  const placedDir = placedDirOf(rootDir, source.name);
  place(entry, placedDir);
  return { placedDir, imports: entry.manifest.imports ?? {}, built };
};

export { servePackage };
