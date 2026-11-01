/* @layer tooling-scripts @kind logic */
import { basename } from 'node:path';
import { attempt } from '../replay/replay-exec.mjs';

const parsed = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * @param {{ exec: Function, cwd: string, sha: string }} input the runner seam and the commit
 * @returns {object[]} the commit's package.json files, read from git
 */
const manifestsAt = ({ exec, cwd, sha }) => {
  const listed = (attempt(exec, 'git', ['ls-tree', '-r', '--name-only', sha], cwd) ?? '').split('\n').map((line) => line.trim());
  const names = listed.filter((path) => basename(path) === 'package.json' && !path.includes('node_modules'));
  return names.map((name) => parsed(attempt(exec, 'git', ['show', `${sha}:${name}`], cwd))).filter(Boolean);
};

export { manifestsAt };
