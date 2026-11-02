/* @layer tooling-scripts @kind logic */
import { STANDARDS_CI } from './ci.constants.mjs';

const EVENT_GATED = /\bgithub\.event(_name)?\b/;

/**
 * @param {{ uses: string | null, if: string | null }} job
 * @returns {boolean} true for another reusable workflow or an event gate
 */
const isGithubOnly = (job) => {
  if (job.uses) return !STANDARDS_CI.test(job.uses);
  return EVENT_GATED.test(job.if ?? '');
};

export { isGithubOnly };
