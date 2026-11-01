/* @layer tooling-scripts @kind logic */
import { STANDARDS_CI } from './ci.constants.mjs';

const EVENT_GATED = /\bgithub\.event(_name)?\b/;

/**
 * A job that only GitHub runs is left out of the local plan.
 * @param {{ uses: string | null, if: string | null }} job
 * @returns {boolean} true for another reusable workflow, or a job gated on the event
 */
const isGithubOnly = (job) => {
  if (job.uses) return !STANDARDS_CI.test(job.uses);
  return EVENT_GATED.test(job.if ?? '');
};

export { isGithubOnly };
