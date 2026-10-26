/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_ENV, BASE_REFS, MAX_CHANGED_FILES, WHOLE_TREE_FILES } from './lint.constants.mjs';

const git = (cwd, args) => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return result.status === 0 ? result.stdout.trim() : null;
};

const lines = (text) => (text ? text.split(/\r?\n/).filter(Boolean) : []);

const knownRef = (cwd, ref) => Boolean(ref) && git(cwd, ['rev-parse', '--verify', '--quiet', ref]) !== null;

const baseRef = (cwd, env) => {
  if (env[BASE_ENV]) return knownRef(cwd, env[BASE_ENV]) ? env[BASE_ENV] : undefined;
  const remoteHead = git(cwd, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']);
  return [remoteHead, ...BASE_REFS].find((ref) => knownRef(cwd, ref));
};

/**
 * @param {string} cwd the folder eslint runs in
 * @param {NodeJS.ProcessEnv} [env] BROCK_LINT_BASE names the branch to compare with
 * @returns {{ files: string[], base: string, ref: string } | { failure: string }} changed and untracked files, or why unknown
 */
const changedFiles = (cwd, env = process.env) => {
  if (git(cwd, ['rev-parse', '--is-inside-work-tree']) !== 'true') return { failure: 'not a git work tree' };
  const ref = baseRef(cwd, env);
  if (!ref) return { failure: `no default branch found (${BASE_REFS.join(', ')})` };
  const base = git(cwd, ['merge-base', 'HEAD', ref]);
  if (!base) return { failure: `no merge base with ${ref}` };
  const tracked = lines(git(cwd, ['diff', '--name-only', '--diff-filter=ACMR', '--relative', base]));
  const untracked = lines(git(cwd, ['ls-files', '--others', '--exclude-standard']));
  const files = [...new Set([...tracked, ...untracked])].filter((file) => existsSync(join(cwd, file))).sort();
  return { files, base: base.slice(0, 8), ref };
};

/**
 * @param {string[]} files changed files
 * @returns {string | null} why the whole tree must be linted
 */
const needsWholeTree = (files) => {
  const config = files.find((file) => WHOLE_TREE_FILES.test(file));
  if (config) return `${config} can change every result`;
  return files.length > MAX_CHANGED_FILES ? `${files.length} changed files is more than ${MAX_CHANGED_FILES}` : null;
};

/**
 * @param {string} cwd the folder eslint runs in
 * @returns {number | null} tracked and untracked files here
 */
const treeFileCount = (cwd) => {
  const listed = git(cwd, ['ls-files', '--cached', '--others', '--exclude-standard']);
  return listed === null ? null : lines(listed).length;
};

export { changedFiles, needsWholeTree, treeFileCount };
