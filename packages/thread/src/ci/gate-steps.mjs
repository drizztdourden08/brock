/* @layer tooling-scripts @kind logic */

const ORDER = ['structure', 'lint:md', 'lint', 'test', 'app:build'];

const rank = (script) => {
  const at = ORDER.indexOf(script);
  return at < 0 ? -1 : at;
};

/**
 * @param {string[]} scripts
 * @returns {string[]} the scripts in run order
 */
const inRunOrder = (scripts) => [...scripts].sort((a, b) => rank(a) - rank(b));

/**
 * @param {string} script a package script of the gate
 * @param {object} place job, jobId, needs, always
 * @param {{ testRef: string, lintMode: string, lintBase?: string } | null} scope what the run covers
 * @returns {object} the planned step
 */
const scriptStep = (script, place, scope) => {
  const step = { name: script, command: `pnpm run ${script}`, ...place };
  if (!scope) return step;
  if (script === 'test') return { ...step, command: `pnpm run test --base ${scope.testRef}` };
  if (script !== 'lint') return step;
  return { ...step, stepEnv: { BROCK_LINT_MODE: scope.lintMode, ...(scope.lintBase ? { BROCK_LINT_BASE: scope.lintBase } : {}) } };
};

export { inRunOrder, scriptStep };
