/* @layer tooling-scripts @kind logic */
import { gitAt } from '../../git.mjs';
import { integrationBranch } from '../../local/integration-branch.mjs';
import { projectOf } from '../../ci/project-of.mjs';
import { commitNotes, cutVersion, leaveReleaseBranch, requireNotes } from './release-cut.mjs';
import { changedPackages } from './release-packages.mjs';
import { openReleasePr } from './release-pr.mjs';
import { inspectCheckout } from './release-state.mjs';
import { ReleaseStop } from './release-stop.mjs';
import { runCommand } from './run-command.mjs';
import { writeRelease } from './write-release.mjs';

const CHANNEL = /^[a-z0-9][a-z0-9._-]*$/i;

const noExtraAssets = () => [];

const channelOf = (options) => {
  const channel = typeof options.channel === 'string' ? options.channel : 'latest';
  if (!CHANNEL.test(channel)) throw new ReleaseStop(`--channel takes plain letters, digits, dots and dashes, got "${channel}".`);
  return channel;
};

const requestOf = ({ cwd, options, workspace, log, exec, extraAssets }) => {
  const root = gitAt(['rev-parse', '--show-toplevel'], cwd);
  const project = projectOf(options, workspace);
  const integration = integrationBranch({ options, project, base: workspace.base, cwd: root });
  return { cwd: root, project, channel: channelOf(options), integration, log, exec, extraAssets };
};

const release = (request, cut, state) => {
  requireNotes({ cwd: request.cwd, ...cut });
  commitNotes({ cwd: request.cwd, version: cut.version });
  const commit = gitAt(['rev-parse', 'HEAD'], request.cwd);
  const packages = changedPackages({ cwd: request.cwd, base: state.base });
  if (packages.length === 0) throw new ReleaseStop('No public package changed version, so there is nothing to pack.', 1);
  const meta = { cwd: request.cwd, project: request.project, channel: request.channel, version: cut.version, commit };
  return { file: writeRelease({ release: meta, packages, exec: request.exec, extraAssets: request.extraAssets }), commit };
};

const finish = ({ request, cut, state, written }) => {
  const back = leaveReleaseBranch({ cwd: request.cwd, integration: request.integration, state });
  request.log(`Packed ${cut.version} into the release store. ${back ? `Back on ${back.length === 40 ? back.slice(0, 9) : back}.` : `Still on ${cut.branch}.`}`);
  const meta = { project: request.project, channel: request.channel, branch: cut.branch, integration: request.integration, version: cut.version, commit: written.commit };
  openReleasePr({ release: meta, cwd: request.cwd, exec: request.exec, log: request.log });
  request.log(`Not merged. After the check run passes: coord pr merge <PR-n>. Replay to the registry waits for the owner's go.`);
};

/**
 * @param {{ cwd: string, options: Record<string, string | boolean>, workspace: object, log: (line: string) => void, exec?: Function, extraAssets?: Function, announce?: (line: string) => void }} input extraAssets({ cwd, project, channel, version, commit, stage }) returns [{ name, path, kind }] to copy into the version folder
 * @returns {number} 0 released, 2 a stop to fix and run again, 1 a failure
 */
const runLocalRelease = ({ cwd, options, workspace, log, exec = runCommand, extraAssets = noExtraAssets, announce = console.log }) => {
  try {
    const request = requestOf({ cwd, options, workspace, log, exec, extraAssets });
    const state = inspectCheckout(request);
    const cut = state.kind === 'start' ? { cwd: request.cwd, ...cutVersion(request) } : { cwd: request.cwd, version: state.version, branch: state.branch };
    const written = release(request, cut, state);
    finish({ request, cut, state, written });
    announce(written.file);
    return 0;
  } catch (error) {
    if (!(error instanceof ReleaseStop)) throw error;
    console.error(`[${workspace.name}] x ${error.message}`);
    return error.code;
  }
};

export { runLocalRelease };
