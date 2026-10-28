/* @layer tooling-scripts @kind logic */
import { changedFiles, needsWholeTree, treeFiles } from './changed-files.mjs';
import { batchSizeOf, splitBatches } from './lint-batches.mjs';
import { chooseMode } from './lint-mode.mjs';

const label = 'brock lint';

const fullTree = (cwd, reason, env) => {
  const files = treeFiles(cwd);
  if (!files?.length) return { mode: 'all', targets: ['.'], batches: null, line: `${label}: full tree (${reason}), all files` };
  const batches = splitBatches(files, batchSizeOf(env));
  const line = `${label}: full tree (${reason}), ${files.length} files in ${batches.length} ${batches.length === 1 ? 'batch' : 'batches'}`;
  return { mode: 'all', targets: ['.'], batches, line };
};

const changedPlan = (cwd, env) => {
  const found = changedFiles(cwd, env);
  if ('failure' in found) return fullTree(cwd, `changed files unknown: ${found.failure}`, env);
  const whole = needsWholeTree(found.files);
  if (whole) return fullTree(cwd, whole, env);
  const since = `since ${found.base} (merge base with ${found.ref})`;
  if (!found.files.length) return { mode: 'changed', targets: [], line: `${label}: changed mode, 0 files changed ${since}, nothing to lint` };
  return { mode: 'changed', targets: found.files, line: `${label}: changed mode, ${found.files.length} files changed ${since}` };
};

/**
 * @param {{ cwd: string, all?: boolean, changed?: boolean, paths?: string[], env?: NodeJS.ProcessEnv }} opts
 * @returns {{ mode: 'all' | 'changed' | 'paths', targets: string[], batches?: string[][] | null, line: string }} targets, batches and mode line
 */
const planLint = ({ cwd, all, changed, paths = [], env = process.env }) => {
  const { mode, reason } = chooseMode({ all, changed, paths, env });
  if (mode === 'paths') return { mode, targets: paths, line: `${label}: ${reason}, ${paths.length} paths` };
  return mode === 'all' ? fullTree(cwd, reason, env) : changedPlan(cwd, env);
};

export { planLint };
