/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { hasPnpmPackageManager } from './pnpm-package-manager.mjs';

/**
 * @param {string} rootDir the app root
 * @param {string[]} paths from the app root
 * @returns {string[]} the paths git ignores and does not track
 */
const ignoredByGit = (rootDir, paths) => {
  if (!paths.length) return [];
  const result = spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd: rootDir, encoding: 'utf8', input: `${paths.join('\0')}\0` });
  if (result.status !== 0) return [];
  const ignored = new Set(result.stdout.split('\0').filter(Boolean).map((path) => resolve(rootDir, path)));
  return paths.filter((path) => ignored.has(resolve(rootDir, path)));
};

/**
 * @param {string} rootDir the app root
 * @param {string[]} workflows the managed workflow files, from the app root
 * @returns {string[]} why the workflows would not run as written
 */
const workflowProblems = (rootDir, workflows) => {
  if (!workflows.length) return [];
  const ignored = ignoredByGit(rootDir, workflows).map((path) => `${path} is ignored by git, so a commit leaves it out. Add !.github/ after the rule that hides it (git check-ignore -v ${path} names it); brock sync does it for a .*/ line in the repo's .gitignore.`);
  const repoDir = findWorkspaceRoot(rootDir) ?? rootDir;
  const pnpm = hasPnpmPackageManager(repoDir) ? [] : ['The package.json at the repo root has no "packageManager": "pnpm@<version>". The managed workflows install the pnpm it names; add it with the version pnpm --version prints.'];
  return [...ignored, ...pnpm];
};

export { workflowProblems };
