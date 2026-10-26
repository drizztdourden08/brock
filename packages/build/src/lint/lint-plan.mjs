/* @layer tooling-scripts @kind logic */
import { changedFiles, needsWholeTree, treeFileCount } from './changed-files.mjs';
import { chooseMode } from './lint-mode.mjs';

const label = 'brock lint';

const fullTree = (cwd, reason) => {
  const count = treeFileCount(cwd);
  return { mode: 'all', targets: ['.'], line: `${label}: full tree (${reason}), ${count ?? 'all'} files` };
};

const changedPlan = (cwd, env) => {
  const found = changedFiles(cwd, env);
  if ('failure' in found) return fullTree(cwd, `changed files unknown: ${found.failure}`);
  const whole = needsWholeTree(found.files);
  if (whole) return fullTree(cwd, whole);
  const since = `since ${found.base} (merge base with ${found.ref})`;
  if (!found.files.length) return { mode: 'changed', targets: [], line: `${label}: changed mode, 0 files changed ${since}, nothing to lint` };
  return { mode: 'changed', targets: found.files, line: `${label}: changed mode, ${found.files.length} files changed ${since}` };
};

/**
 * @param {{ cwd: string, all?: boolean, changed?: boolean, paths?: string[], env?: NodeJS.ProcessEnv }} opts
 * @returns {{ mode: 'all' | 'changed' | 'paths', targets: string[], line: string }} eslint targets and the mode line
 */
const planLint = ({ cwd, all, changed, paths = [], env = process.env }) => {
  const { mode, reason } = chooseMode({ all, changed, paths, env });
  if (mode === 'paths') return { mode, targets: paths, line: `${label}: ${reason}, ${paths.length} paths` };
  return mode === 'all' ? fullTree(cwd, reason) : changedPlan(cwd, env);
};

export { planLint };
