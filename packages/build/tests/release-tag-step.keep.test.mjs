/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir: emptyDir, put, cleanup } = tempTree('brock-tag-step-');
afterEach(cleanup);

const git = (cwd, ...args) => {
  const result = spawnSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args], { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
};

const commitFile = (dir, file, content, message) => {
  put(dir, file, content);
  git(dir, 'add', '.');
  git(dir, 'commit', '-m', message);
  git(dir, 'push', 'origin', 'HEAD:main');
};

const repoWithOrigin = () => {
  const origin = emptyDir();
  git(origin, 'init', '--bare', '--initial-branch=main', '.');
  const work = emptyDir();
  git(work, 'clone', origin, '.');
  commitFile(work, 'apps/desktop/package.json', '{\n  "name": "atlas",\n  "version": "1.1.0"\n}\n', 'start');
  return { origin, work };
};

const TAG_STEP = parse(composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'atlas-' }).release)
  .jobs.release.steps.find((step) => step.name === 'Commit the version and tag it')?.run ?? '';

const tagRun = (work) => {
  const script = TAG_STEP.replaceAll('${{ needs.prepare.outputs.tag }}', 'v1.2.0').replaceAll('${{ needs.prepare.outputs.version }}', '1.2.0');
  const result = spawnSync('bash', ['-e', '-c', script], { cwd: work, encoding: 'utf8', env: { ...process.env, BRANCH: 'main', APP_DIR: 'apps/desktop' } });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};

const versionAt = (origin, ref) => JSON.parse(git(origin, 'show', `${ref}:apps/desktop/package.json`)).version;

describe('the tag step of the release job, run by bash', () => {
  it('commits the version on the built commit, tags it and moves the default branch to it', () => {
    const { origin, work } = repoWithOrigin();
    const result = tagRun(work);
    expect(result.code, result.out).toBe(0);
    expect(versionAt(origin, 'v1.2.0')).toBe('1.2.0');
    expect(git(origin, 'rev-parse', 'main')).toBe(git(origin, 'rev-parse', 'v1.2.0^{commit}'));
  });

  it('puts the bump on top of the default branch when it moved during the builds', () => {
    const { origin, work } = repoWithOrigin();
    const other = emptyDir();
    git(other, 'clone', origin, '.');
    commitFile(other, 'notes.md', 'later\n', 'later');
    const result = tagRun(work);
    expect(result.code, result.out).toBe(0);
    expect(versionAt(origin, 'v1.2.0')).toBe('1.2.0');
    expect(versionAt(origin, 'main')).toBe('1.2.0');
    expect(git(origin, 'log', '--format=%s', 'main')).toBe('release: v1.2.0\nlater\nstart');
  });
});
