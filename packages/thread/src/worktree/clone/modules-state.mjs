/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { INSTALLED_LOCKFILE, MODULES_STATE, STATE_KEYS } from './clone.constants.mjs';

const readText = (file) => {
  try {
    return readFileSync(file);
  } catch {
    return null;
  }
};

const unquote = (value) => value.trim().replace(/^(['"])(.*)\1$/, '$2');

/**
 * @param {string} text the .modules.yaml pnpm writes
 * @returns {Map<string, string>} each top-level key with its whole block
 */
const blocksOf = (text) => {
  const blocks = new Map();
  let key = null;
  for (const line of text.split(/\r?\n/)) {
    const top = /^([A-Za-z][\w-]*):(.*)$/.exec(line);
    if (top) {
      key = top[1];
      blocks.set(key, top[2]);
    } else if (key && line.trim()) blocks.set(key, `${blocks.get(key)}\n${line}`);
  }
  return blocks;
};

/**
 * @typedef {object} ModulesState
 * @property {string} virtualStore the folder that holds every installed package
 * @property {Buffer} lockfile the lockfile pnpm installed, byte for byte
 * @property {string} settings a hash of the layout settings that shape node_modules
 */

/**
 * @param {string} root a checkout or a workspace root
 * @returns {ModulesState | null} what pnpm installed there, null when it is not a complete pnpm install
 */
const modulesState = (root) => {
  const text = readText(join(root, 'node_modules', MODULES_STATE))?.toString('utf8');
  if (!text) return null;
  const blocks = blocksOf(text);
  if (unquote(blocks.get('nodeLinker') ?? '') !== 'isolated') return null;
  const named = unquote(blocks.get('virtualStoreDir') ?? '');
  if (!named) return null;
  const virtualStore = isAbsolute(named) ? named : resolve(root, 'node_modules', named);
  const lockfile = readText(join(virtualStore, INSTALLED_LOCKFILE));
  if (!lockfile) return null;
  const settings = createHash('sha256').update(STATE_KEYS.map((key) => `${key}:${blocks.get(key) ?? ''}`).join('\n')).digest('hex');
  return { virtualStore, lockfile, settings };
};

export { modulesState };
