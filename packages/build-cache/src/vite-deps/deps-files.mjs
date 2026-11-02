/* @layer tooling-scripts @kind logic */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { realStoreOf, storeRootsOf } from './store-paths.mjs';
import { BUNDLE_FILE, FILE_TOKENS } from './vite-deps.constants.mjs';

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const folderOf = (path) => `${path.split(sep).join('/').replace(/\/+$/, '')}/`;

const FLAGS = process.platform === 'win32' ? 'gi' : 'g';

/**
 * @param {string} dir a pre-bundle folder
 * @param {[string, string][]} pairs each text and what replaces it
 * @returns {void} every bundle file and map in it, rewritten in place
 */
const rewriteBundles = (dir, pairs) => {
  const rules = [...pairs].sort(([a], [b]) => b.length - a.length).map(([from, to]) => [new RegExp(escape(from), FLAGS), () => to]);
  for (const name of readdirSync(dir)) {
    if (!BUNDLE_FILE.test(name)) continue;
    const file = join(dir, name);
    const text = readFileSync(file, 'utf8');
    const next = rules.reduce((current, [pattern, to]) => current.replace(pattern, to), text);
    if (next !== text) writeFileSync(file, next);
  }
};

/**
 * @param {string} dir a copy of the pre-bundle Vite wrote
 * @param {string} installRoot the install it was written in
 * @returns {void} absolute paths into its package store or install folder become tokens
 */
const portableBundles = (dir, installRoot) => rewriteBundles(dir, [
  ...storeRootsOf(installRoot).map((root) => [folderOf(root), FILE_TOKENS.store]),
  [folderOf(installRoot), FILE_TOKENS.root],
]);

/**
 * @param {string} dir a stored pre-bundle copied into this install
 * @param {string} installRoot this install folder
 * @returns {void} the tokens become this install's package store and folder
 */
const localBundles = (dir, installRoot) => rewriteBundles(dir, [
  [FILE_TOKENS.store, folderOf(realStoreOf(installRoot))],
  [FILE_TOKENS.root, folderOf(installRoot)],
]);

export { localBundles, portableBundles };
