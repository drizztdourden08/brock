/* @layer tooling-scripts @kind logic */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { STORE_LAYOUT, STORE_RECORD } from './clone.constants.mjs';

const PACKAGES = ['node_modules', '.pnpm'];

const ROOT_KEY = '/';

/**
 * @param {string} virtualStore the packages folder of a store entry
 * @returns {string} the store entry that holds it
 */
const entryOf = (virtualStore) => dirname(dirname(virtualStore));

const countIn = (dir) => {
  try {
    return readdirSync(dir).length;
  } catch {
    return 0;
  }
};

const innerCount = (dir, entry) => {
  if (!entry.isDirectory()) return 0;
  if (!entry.name.startsWith('@')) return countIn(join(dir, entry.name));
  return readdirSync(join(dir, entry.name)).reduce((sum, name) => sum + countIn(join(dir, entry.name, name)), 0);
};

const shapeOf = (nodeModules) => {
  try {
    const entries = readdirSync(nodeModules, { withFileTypes: true });
    return `${entries.length}:${entries.reduce((sum, entry) => sum + innerCount(nodeModules, entry), 0)}`;
  } catch {
    return '0:0';
  }
};

/**
 * @param {string} entry a store entry
 * @returns {Record<string, string>} each package folder with the shape of what it holds
 */
const describeStore = (entry) => {
  const packages = join(entry, ...PACKAGES);
  const shape = { [ROOT_KEY]: `${countIn(join(entry, 'node_modules'))}` };
  for (const dirent of readdirSync(packages, { withFileTypes: true })) {
    if (dirent.isDirectory()) shape[dirent.name] = shapeOf(join(packages, dirent.name, 'node_modules'));
  }
  return shape;
};

/**
 * @param {string} dir a store entry
 * @returns {Record<string, any> | null} the record written when the entry was built
 */
const readStoreRecord = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, STORE_RECORD), 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @param {string} dir a store entry
 * @param {string | null} key the key it must have been built for, null for any
 * @returns {string[]} packages missing or emptied, or the record itself
 */
const storeDamage = (dir, key = null) => {
  const record = readStoreRecord(dir);
  if (record?.layout !== STORE_LAYOUT || !record.manifest || (key && record.key !== key)) return [STORE_RECORD];
  try {
    const now = describeStore(dir);
    return Object.entries(record.manifest).filter(([name, shape]) => now[name] !== shape).map(([name]) => name);
  } catch {
    return [PACKAGES.join('/')];
  }
};

/**
 * @param {string} dir a store entry
 * @param {string} key
 * @returns {boolean} true when the entry is whole for this key
 */
const storeIsComplete = (dir, key) => storeDamage(dir, key).length === 0;

export { describeStore, entryOf, PACKAGES, storeDamage, storeIsComplete };
