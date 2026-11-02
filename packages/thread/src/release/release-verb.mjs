/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { flag } from '../cli/thread-args.mjs';
import { ghLoud } from '../gh.mjs';
import { deferredNote, isLocalMode } from '../local/remote-mode.mjs';
import { checkNoteFile } from '../release-notes/check-note-file.mjs';
import { findAppDir } from '../release-notes/find-app-dir.mjs';
import { resolveNotesRoot } from '../release-notes/resolve-notes-root.mjs';
import { runLocalRelease } from './local/local-release.mjs';
import { highestNotesVersion, notesFileFor } from './notes-version.mjs';

const WORKFLOW = 'release.yml';

const USAGE = [
  '  brock release [version] [--latest | --prerelease] [--full] [--app <name>]',
  '                               run the release workflow for v<version> (asks); the version defaults to the',
  '                               highest release-notes/v*.md of the app folder (the repo root when only it has notes).',
  '                               Without a dispatchable .github/workflows/release.yml',
  '                               it creates the GitHub release from the notes instead. The note must pass',
  '                               brock release-notes check first. In a repo that releases several apps,',
  '                               --app <name> runs release-<name>.yml with the notes of apps/<name>',
  '  brock release --local [--channel latest] [--integration <branch>] [--project <key>]',
  '                               cut a release on this machine, no GitHub: changeset version on a release/local-<version> branch,',
  '                               the release note check (exit 2 until the note is written, then run it again), every changed public',
  '                               package packed with pnpm pack into ~/.coord/releases/<project>/<channel>/<version>/ with release.json',
  '                               written last, and a local pull request. It never merges. The last line is the release.json path',
].join('\n');

const planOf = (ctx, options) => {
  const app = typeof options.app === 'string' ? options.app : null;
  const appDir = app ? `apps/${app}` : (findAppDir(ctx.rootDir) ?? '.');
  const notes = resolveNotesRoot({ repoDir: ctx.rootDir, appDir, rootFallback: !app });
  if (notes.fallback) ctx.log(`No ${appDir}/release-notes; reading release-notes at the repo root.`);
  return { app, notesRoot: join(ctx.rootDir, notes.root), workflow: app ? `release-${app}.yml` : WORKFLOW };
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
  ghLoud(['workflow', 'run', workflow, '--ref', ctx.workspace.base, ...fields], ctx.rootDir);
  ctx.log(`Queued ${tag}. Follow it with: gh run watch`);
};

const createRelease = (ctx, tag, notes) => {
  ctx.log(`gh release create ${tag} --notes-file ${notes} --title ${tag}`);
  ghLoud(['release', 'create', tag, '--notes-file', notes, '--title', tag], ctx.rootDir);
  ctx.log(`Release ${tag} created.`);
};

const run = async (positional, options, ctx) => {
  if (flag(options, 'local')) return runLocalRelease({ cwd: process.cwd(), options, workspace: ctx.workspace, log: ctx.log });
  const plan = planOf(ctx, options);
  const tag = releaseTag(positional, plan.notesRoot);
  const notes = notesFileFor(plan.notesRoot, tag);
  const findings = checkNoteFile({ rootDir: plan.notesRoot, version: tag });
  if (findings.length) throw new Error([`${notes} does not follow the release note standard yet:`, ...findings].join('\n  '));
  if (!plan.app && tagExists(ctx.rootDir, tag)) throw new Error(`Tag ${tag} already exists. Pick a new version.`);
  if (isLocalMode()) {
    ctx.log(`Would release ${tag} from ${notes} on GitHub.`);
    ctx.log(deferredNote('the GitHub release'));
    ctx.log('To cut the release on this machine, run: brock release --local');
    return;
  }
  if (dispatchable(ctx.rootDir, plan.workflow)) dispatch(ctx, tag, { options, workflow: plan.workflow });
  else if (plan.app) throw new Error(`No .github/workflows/${plan.workflow}. Run brock sync in apps/${plan.app}.`);
  else createRelease(ctx, tag, join(plan.notesRoot, notes));
};

/** @type {import('../workspace/workspace.type.mjs').Verb} */
const releaseVerb = { usage: USAGE, run, asks: true };

export { releaseVerb };
