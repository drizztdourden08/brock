/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { FIXTURES_DIR, REVIEW_DIR, REVIEW_SEED, STEP_ID, STEP_SUFFIX } from './review.constants.mjs';

const listFixtures = (folder) => {
  const root = join(folder, FIXTURES_DIR);
  if (!existsSync(root)) return [];
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .sort();
};

/**
 * @param {string} rootDir  The app root
 * @returns {{ seed: boolean, steps: string[], fixtures: string[] }}  The review files, sorted
 */
const scanReview = (rootDir) => {
  const folder = join(rootDir, REVIEW_DIR);
  if (!existsSync(folder)) return { seed: false, steps: [], fixtures: [] };
  const names = readdirSync(folder);
  const steps = names.filter((name) => name.endsWith(STEP_SUFFIX)).map((name) => name.slice(0, -STEP_SUFFIX.length));
  const bad = steps.find((id) => !STEP_ID.test(id));
  if (bad !== undefined) throw new Error(`${REVIEW_DIR}/${bad}${STEP_SUFFIX}: a review step file is <kebab-case-id>${STEP_SUFFIX}`);
  return { seed: names.includes(REVIEW_SEED), steps: steps.sort(), fixtures: listFixtures(folder) };
};

export { scanReview };
