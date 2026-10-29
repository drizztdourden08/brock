/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CLONE_RECORD } from './clone.constants.mjs';
import { entryOf, storeDamage } from './store-entry.mjs';

const cloneRecordAbove = (appDir) => {
  for (let dir = appDir; ; dir = dirname(dir)) {
    try {
      return JSON.parse(readFileSync(join(dir, 'node_modules', CLONE_RECORD), 'utf8'));
    } catch {
      if (dirname(dir) === dir) return null;
    }
  }
};

/**
 * @param {string} appDir an app folder, or a checkout whose node_modules was cloned
 * @returns {string | null} the warning when the shared store is damaged, else null
 */
const cloneStoreProblem = (appDir) => {
  const record = cloneRecordAbove(appDir);
  if (typeof record?.store !== 'string') return null;
  const entry = entryOf(record.store);
  const damage = storeDamage(entry);
  if (damage.length === 0) return null;
  return `shared store damaged, rebuild it: ${entry} lost or emptied ${damage.length} package folder(s) (first: ${damage[0]}). The damaged entry is left in place. The next \`brock worktree create\` for this lockfile builds a fresh store; recreate this worktree to use it.`;
};

export { cloneStoreProblem };
