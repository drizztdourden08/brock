/* @layer tooling-scripts @kind logic */

const named = ({ all, changed, paths }) => {
  if (paths.length) return { mode: 'paths', reason: 'files named on the command line' };
  if (all) return { mode: 'all', reason: '--all' };
  return changed ? { mode: 'changed', reason: '--changed' } : null;
};

/**
 * @param {{ all?: boolean, changed?: boolean, paths?: string[], env?: NodeJS.ProcessEnv }} opts
 * @returns {{ mode: 'all' | 'changed' | 'paths', reason: string }} files named, else --all or CI, else changed
 */
const chooseMode = ({ all = false, changed = false, paths = [], env = process.env }) => {
  if (all && changed) throw new Error('brock lint: --all and --changed exclude each other');
  return named({ all, changed, paths }) ?? (env.CI ? { mode: 'all', reason: 'CI is set' } : { mode: 'changed', reason: 'local run' });
};

export { chooseMode };
