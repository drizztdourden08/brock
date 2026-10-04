/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REVIEW_DIR, REVIEW_SEED, STEP_ID, STEP_SUFFIX } from './review.constants.mjs';

/**
 * @param {string} rootDir  The app root
 * @returns {{ seed: boolean, steps: string[] }}  The seed and the step ids, sorted
 */
const scanReview = (rootDir) => {
  const folder = join(rootDir, REVIEW_DIR);
  if (!existsSync(folder)) return { seed: false, steps: [] };
  const names = readdirSync(folder);
  const steps = names.filter((name) => name.endsWith(STEP_SUFFIX)).map((name) => name.slice(0, -STEP_SUFFIX.length));
  const bad = steps.find((id) => !STEP_ID.test(id));
  if (bad !== undefined) throw new Error(`${REVIEW_DIR}/${bad}${STEP_SUFFIX}: a review step file is <kebab-case-id>${STEP_SUFFIX}`);
  return { seed: names.includes(REVIEW_SEED), steps: steps.sort() };
};

export { scanReview };
