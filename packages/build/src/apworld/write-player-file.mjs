/* @layer tooling-scripts @kind build */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { callEntry } from './call-entry.mjs';
import { playerOptionsOf } from './player-options.mjs';
import { readAppVersion } from './read-app-version.mjs';

/**
 * @param {string} rootDir The app root
 * @param {{ entry?: string, fn?: string, name?: string, file?: string, seed?: string, optionsFile?: string, set?: string[] }} options The command options
 * @returns {Promise<string>} one line saying what was written
 */
const writePlayerFile = async (rootDir, options) => {
  const { name, file, seed } = options;
  if (!name || !file) throw new Error('give the slot name and the output file: --name <slot> --out <file.yaml>');
  const made = await callEntry(rootDir, options, {
    slotName: name,
    options: playerOptionsOf(options),
    seedText: seed ?? name,
    appVersion: readAppVersion(rootDir),
  });
  const target = resolve(rootDir, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof made === 'string' ? made : made.yaml);
  return `${relative(rootDir, target)}: player file written`;
};

export { writePlayerFile };
