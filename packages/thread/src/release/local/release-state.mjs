/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gitAt, tryGitAt } from '../../git.mjs';
import { notePath } from '../../release-notes/check-note-file.mjs';
import { stop } from './release-stop.mjs';

const RELEASE_BRANCH = /^release\/local-(.+)$/;
const CHANGESET_DIR = '.changeset';

const short = (sha) => sha.slice(0, 9);

/**
 * @param {string} ref a local branch
 * @param {string} cwd
 * @returns {string | null} its tip commit
 */
const tipOf = (ref, cwd) => tryGitAt(['rev-parse', '--verify', '--quiet', `refs/heads/${ref}^{commit}`], cwd);

/**
 * @param {string} cwd
 * @returns {string | null} the checked out branch, null when detached
 */
const currentBranch = (cwd) => {
  const name = tryGitAt(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  return name && name !== 'HEAD' ? name : null;
};

/**
 * @param {string} cwd
 * @returns {string[]} the pending changeset files
 */
const pendingChangesets = (cwd) => {
  const dir = join(cwd, CHANGESET_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md');
};

const startState = ({ cwd, integration, base }) => {
  const head = gitAt(['rev-parse', 'HEAD'], cwd);
  if (head !== base) throw stop(`HEAD (${short(head)}) is not the tip of ${integration} (${short(base)}). Check out ${integration} first.`);
  if (gitAt(['status', '--porcelain'], cwd)) throw stop('The checkout is not clean. Commit or remove what git status shows, then run again.');
  if (pendingChangesets(cwd).length === 0) throw stop(`There are no pending changesets in ${CHANGESET_DIR}. Nothing to release.`);
  return { kind: 'start', base, original: currentBranch(cwd) ?? head };
};

const resumeState = ({ cwd, integration, base, version }) => {
  if (tryGitAt(['merge-base', '--is-ancestor', base, 'HEAD'], cwd) === null) throw stop(`This release branch is not on top of ${integration} (${short(base)}). Delete it and start again from ${integration}.`);
  const allowed = notePath(version);
  const stray = gitAt(['status', '--porcelain'], cwd).split('\n').filter(Boolean).filter((line) => line.slice(3) !== allowed);
  if (stray.length) throw stop(`The release branch has changes besides ${allowed}:\n  ${stray.join('\n  ')}`);
  if (pendingChangesets(cwd).length) throw stop(`This release branch still has pending changesets, so its version commit is not whole. Delete the branch and start again from ${integration}.`);
  return { kind: 'resume', base, version, branch: currentBranch(cwd) };
};

/**
 * @param {{ cwd: string, integration: string }} request
 * @returns {{ kind: 'start' | 'resume', base: string, original?: string, version?: string, branch?: string }}
 */
const inspectCheckout = ({ cwd, integration }) => {
  const base = tipOf(integration, cwd);
  if (!base) throw stop(`There is no local branch "${integration}". Name the integration branch with --integration <branch>.`);
  const version = RELEASE_BRANCH.exec(currentBranch(cwd) ?? '')?.[1];
  return version ? resumeState({ cwd, integration, base, version }) : startState({ cwd, integration, base });
};

export { inspectCheckout };
