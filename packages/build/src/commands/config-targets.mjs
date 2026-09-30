/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { readTargets, writeTargets } from '../platforms/targets-source.mjs';

/**
 * @param {string} rootDir
 * @returns {{ targets: string[], write: (next: string[]) => boolean }} write reports whether the file changed
 */
const configTargets = (rootDir) => {
  const file = join(rootDir, CONFIG_FILE);
  if (!existsSync(file)) throw new Error(`No ${CONFIG_FILE} in ${rootDir}`);
  const source = readFileSync(file, 'utf8');
  const targets = readTargets(source) ?? DEFAULT_TARGETS;
  const write = (next) => {
    const updated = writeTargets(source, next);
    if (updated === source) return false;
    writeFileSync(file, updated, 'utf8');
    return true;
  };
  return { targets, write };
};

export { configTargets };
