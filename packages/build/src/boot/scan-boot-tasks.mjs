/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TASK_ID, TASK_SUFFIX } from './boot.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @param {string} dir  The convention folder, relative to the root
 * @returns {string[]}  Task ids from <id>.task.ts file names, sorted
 */
const scanBootTasks = (rootDir, dir) => {
  const folder = join(rootDir, dir);
  if (!existsSync(folder)) return [];
  const ids = readdirSync(folder).filter((name) => name.endsWith(TASK_SUFFIX)).map((name) => name.slice(0, -TASK_SUFFIX.length));
  const bad = ids.find((id) => !TASK_ID.test(id));
  if (bad !== undefined) throw new Error(`${dir}/${bad}${TASK_SUFFIX}: a boot task file is <kebab-case-id>${TASK_SUFFIX}`);
  return ids.sort();
};

export { scanBootTasks };
