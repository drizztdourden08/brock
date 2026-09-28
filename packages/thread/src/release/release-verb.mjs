/* @layer tooling-scripts @kind logic */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { highestNotesVersion, notesFileFor } from './notes-version.mjs';

const WORKFLOW = 'release.yml';

const USAGE = [
  '  brock release [version] [--latest | --prerelease] [--full]',
  '                               run the release workflow for v<version> (asks); the version defaults to the',
  '                               highest release-notes/v*.md. Without a dispatchable .github/workflows/release.yml',
  '                               it creates the GitHub release from the notes instead',
].join('\n');

const dispatchable = (rootDir) => {
  const file = join(rootDir, '.github', 'workflows', WORKFLOW);
  return existsSync(file) && readFileSync(file, 'utf8').includes('workflow_dispatch');
};

const tagExists = (rootDir, tag) => spawnSync('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`], { cwd: rootDir }).status === 0;

const releaseTag = (positional, rootDir) => {
  const version = positional[0] ?? highestNotesVersion(rootDir);
  if (!version) throw new Error('No version given and no release-notes/v*.md to take one from.');
  return `v${version.replace(/^v/, '')}`;
};

const dispatch = (ctx, tag, options) => {
  const latest = flag(options, 'latest');
  const prerelease = flag(options, 'prerelease');
  if (latest && prerelease) throw new Error('--latest and --prerelease exclude each other: a pre-release never becomes the latest download.');
  const inputs = { version: tag, set_latest: latest, prerelease, full: flag(options, 'full') };
  const fields = Object.entries(inputs).flatMap(([key, value]) => ['-f', `${key}=${value}`]);
  ctx.log(`gh workflow run ${WORKFLOW} --ref ${ctx.workspace.base} ${fields.join(' ')}`);
  execFileSync('gh', ['workflow', 'run', WORKFLOW, '--ref', ctx.workspace.base, ...fields], { cwd: ctx.rootDir, stdio: 'inherit' });
  ctx.log(`Queued ${tag}. Follow it with: gh run watch`);
};

const createRelease = (ctx, tag, notes) => {
  ctx.log(`gh release create ${tag} --notes-file ${notes} --title ${tag}`);
  execFileSync('gh', ['release', 'create', tag, '--notes-file', join(ctx.rootDir, notes), '--title', tag], { cwd: ctx.rootDir, stdio: 'inherit' });
  ctx.log(`Release ${tag} created.`);
};

const run = async (positional, options, ctx) => {
  const tag = releaseTag(positional, ctx.rootDir);
  const notes = notesFileFor(ctx.rootDir, tag);
  if (tagExists(ctx.rootDir, tag)) throw new Error(`Tag ${tag} already exists. Pick a new version.`);
  if (dispatchable(ctx.rootDir)) dispatch(ctx, tag, options);
  else createRelease(ctx, tag, notes);
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const releaseVerb = { usage: USAGE, run, asks: true };

export { releaseVerb };
