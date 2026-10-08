/* @layer tooling-scripts @kind logic */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { checkNoteFile } from '../release-notes/check-note-file.mjs';
import { highestNotesVersion, notesFileFor } from './notes-version.mjs';

const WORKFLOW = 'release.yml';

const USAGE = [
  '  brock release [version] [--latest | --prerelease] [--full] [--app <name>]',
  '                               run the release workflow for v<version> (asks); the version defaults to the',
  '                               highest release-notes/v*.md. Without a dispatchable .github/workflows/release.yml',
  '                               it creates the GitHub release from the notes instead. The note must pass',
  '                               brock release-notes check first. In a repo that releases several apps,',
  '                               --app <name> runs release-<name>.yml with the notes of apps/<name>',
].join('\n');

const planOf = (ctx, options) => {
  const app = typeof options.app === 'string' ? options.app : null;
  return app
    ? { app, notesRoot: join(ctx.rootDir, 'apps', app), workflow: `release-${app}.yml` }
    : { app, notesRoot: ctx.rootDir, workflow: WORKFLOW };
};

const dispatchable = (rootDir, workflow) => {
  const file = join(rootDir, '.github', 'workflows', workflow);
  return existsSync(file) && readFileSync(file, 'utf8').includes('workflow_dispatch');
};

const tagExists = (rootDir, tag) => spawnSync('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`], { cwd: rootDir }).status === 0;

const releaseTag = (positional, rootDir) => {
  const version = positional[0] ?? highestNotesVersion(rootDir);
  if (!version) throw new Error('No version given and no release-notes/v*.md to take one from.');
  return `v${version.replace(/^v/, '')}`;
};

const dispatch = (ctx, tag, { options, workflow }) => {
  const latest = flag(options, 'latest');
  const prerelease = flag(options, 'prerelease');
  if (latest && prerelease) throw new Error('--latest and --prerelease exclude each other: a pre-release never becomes the latest download.');
  const inputs = { version: tag, set_latest: latest, prerelease, full: flag(options, 'full') };
  const fields = Object.entries(inputs).flatMap(([key, value]) => ['-f', `${key}=${value}`]);
  ctx.log(`gh workflow run ${workflow} --ref ${ctx.workspace.base} ${fields.join(' ')}`);
  execFileSync('gh', ['workflow', 'run', workflow, '--ref', ctx.workspace.base, ...fields], { cwd: ctx.rootDir, stdio: 'inherit' });
  ctx.log(`Queued ${tag}. Follow it with: gh run watch`);
};

const createRelease = (ctx, tag, notes) => {
  ctx.log(`gh release create ${tag} --notes-file ${notes} --title ${tag}`);
  execFileSync('gh', ['release', 'create', tag, '--notes-file', notes, '--title', tag], { cwd: ctx.rootDir, stdio: 'inherit' });
  ctx.log(`Release ${tag} created.`);
};

const run = async (positional, options, ctx) => {
  const plan = planOf(ctx, options);
  const tag = releaseTag(positional, plan.notesRoot);
  const notes = notesFileFor(plan.notesRoot, tag);
  const findings = checkNoteFile({ rootDir: plan.notesRoot, version: tag });
  if (findings.length) throw new Error([`${notes} does not follow the release note standard yet:`, ...findings].join('\n  '));
  if (!plan.app && tagExists(ctx.rootDir, tag)) throw new Error(`Tag ${tag} already exists. Pick a new version.`);
  if (dispatchable(ctx.rootDir, plan.workflow)) dispatch(ctx, tag, { options, workflow: plan.workflow });
  else if (plan.app) throw new Error(`No .github/workflows/${plan.workflow}. Run brock sync in apps/${plan.app}.`);
  else createRelease(ctx, tag, join(plan.notesRoot, notes));
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const releaseVerb = { usage: USAGE, run, asks: true };

export { releaseVerb };
