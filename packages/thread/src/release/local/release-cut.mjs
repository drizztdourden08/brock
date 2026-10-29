/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { releaseVersionOf } from '@drizztdourden08/standards/release-notes';
import { gitAt } from '../../git.mjs';
import { integrationKey } from '../../local/integration-branch.mjs';
import { checkNoteFile, notePath } from '../../release-notes/check-note-file.mjs';
import { checkedOutAt } from '../../pr/merge-git.mjs';
import { stop } from './release-stop.mjs';

const PENDING_BRANCH = 'release/local-pending';
const NOTES_DIR = 'release-notes';

/**
 * @param {{ cwd: string, integration: string, exec: Function }} request
 * @returns {{ version: string, branch: string }} the new release
 */
const cutVersion = ({ cwd, integration, exec }) => {
  gitAt(['checkout', '-b', PENDING_BRANCH], cwd);
  exec('pnpm', ['exec', 'changeset', 'version'], { cwd });
  if (!gitAt(['status', '--porcelain'], cwd)) throw stop('changeset version changed nothing. Check the pending changesets.', 1);
  const version = releaseVersionOf(cwd);
  const branch = `release/local-${version}`;
  if (gitAt(['branch', '--list', branch], cwd)) throw stop(`The branch ${branch} exists already. Check it out and run again to continue it, or delete it. This checkout is on ${PENDING_BRANCH} with the version changes uncommitted.`);
  gitAt(['branch', '-m', branch], cwd);
  gitAt(['config', integrationKey(branch), integration], cwd);
  gitAt(['add', '-A'], cwd);
  gitAt(['commit', '-m', 'release: version packages'], cwd);
  return { version, branch };
};

/**
 * @param {{ cwd: string, version: string, branch: string }} release
 * @returns {boolean} the repo keeps release notes, so this version needs its note
 */
const needsNotes = ({ cwd }) => existsSync(join(cwd, NOTES_DIR));

/**
 * @param {{ cwd: string, version: string, branch: string }} release
 * @returns {void} throws a stop until the note passes
 */
const requireNotes = (release) => {
  if (!needsNotes(release)) return;
  const findings = checkNoteFile({ rootDir: release.cwd, version: release.version });
  if (findings.length === 0) return;
  const file = join(release.cwd, notePath(release.version));
  throw stop([
    `Release notes are required for v${release.version} and ${file} is not ready:`,
    ...findings.map((line) => `  ${line}`),
    `Write the note there, then run the same command again from ${release.branch}.`,
  ].join('\n'));
};

/**
 * @param {{ cwd: string, version: string }} release
 * @returns {void} commits the note when it is new or changed
 */
const commitNotes = ({ cwd, version }) => {
  const file = notePath(version);
  if (!gitAt(['status', '--porcelain', '--', file], cwd)) return;
  gitAt(['add', '--', file], cwd);
  gitAt(['commit', '-m', `docs: release notes v${version}`], cwd);
};

/**
 * @param {{ cwd: string, integration: string, state: object }} input
 * @returns {string | null} where the checkout went, null if it stayed
 */
const leaveReleaseBranch = ({ cwd, integration, state }) => {
  const target = state.kind === 'start' ? state.original : integration;
  const taken = state.kind === 'resume' && checkedOutAt(integration, cwd);
  if (taken) return null;
  const detached = /^[0-9a-f]{40}$/.test(target);
  gitAt(detached ? ['checkout', '--detach', target] : ['checkout', target], cwd);
  return target;
};

export { commitNotes, cutVersion, leaveReleaseBranch, requireNotes };
