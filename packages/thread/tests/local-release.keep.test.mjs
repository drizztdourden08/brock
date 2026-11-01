/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runLocalRelease } from '../src/release/local/local-release.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const NOTE = `<!-- @layer docs @kind doc -->
# Atlas v1.0.1

The map opens where you left it, and two crashes on start are gone.

## Fixes

- The app no longer closes on start when a profile is empty.
`;

const write = (file, text) => {
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, text);
};

const packageJson = (name, version, extra = {}) => `${JSON.stringify({ name, version, ...extra }, null, 2)}\n`;

let root = '';
let repo = '';
let home = '';
let calls = [];
let announced = [];
const lines = [];
const workspace = { name: 'atlas', base: 'main' };

const fakeExec = (command, args, { cwd, env }) => {
  calls.push([command, ...args]);
  if (command === 'coord') return `PR-1 opened (project ${env.COORD_PROJECT})`;
  if (args[0] === 'exec') {
    for (const name of ['a', 'b']) {
      const file = join(cwd, 'packages', name, 'package.json');
      write(file, readFileSync(file, 'utf8').replace('1.0.0', '1.0.1'));
    }
    rmSync(join(cwd, '.changeset', 'tiny.md'));
    write(join(cwd, 'CHANGELOG.md'), '## 1.0.1\n');
    return '';
  }
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  write(join(args[2], `${pkg.name.replace('@atlas/', 'atlas-')}-${pkg.version}.tgz`), `bytes of ${pkg.name} ${pkg.version}`);
  return '';
};

const release = (extra = {}) =>
  runLocalRelease({ cwd: repo, options: {}, workspace, log: (line) => lines.push(line), exec: fakeExec, announce: (line) => announced.push(line), ...extra });

const quiet = () => vi.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'brock-release-'));
  repo = join(root, 'repo');
  home = join(root, 'coord');
  calls = [];
  announced = [];
  lines.length = 0;
  vi.stubEnv('COORD_HOME', home);
  vi.stubEnv('COORD_PROJECT', 'atlas');
  write(join(home, 'remote.json'), JSON.stringify({ mode: 'local', ciRoots: { atlas: repo } }));
  write(join(repo, 'package.json'), packageJson('atlas', '0.1.0', { private: true }));
  write(join(repo, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
  write(join(repo, 'packages/a/package.json'), packageJson('@atlas/a', '1.0.0'));
  write(join(repo, 'packages/b/package.json'), packageJson('@atlas/b', '1.0.0'));
  write(join(repo, 'packages/c/package.json'), packageJson('@atlas/c', '3.0.0', { private: true }));
  write(join(repo, '.changeset/tiny.md'), "---\n'@atlas/a': patch\n---\n\nFix it.\n");
  write(join(repo, 'release-notes/v1.0.0.md'), NOTE.replace('v1.0.1', 'v1.0.0'));
  git(repo, 'init', '-q', '-b', 'local/main');
  git(repo, 'config', 'user.email', 'test@example.com');
  git(repo, 'config', 'user.name', 'test');
  git(repo, 'config', 'commit.gpgsign', 'false');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'init');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe('E2 brock release --local refuses', { tags: ['e2e'] }, () => {
  it('a dirty checkout, a HEAD that is not the integration tip and a repo with no changeset', () => {
    const errors = quiet();
    write(join(repo, 'stray.txt'), 'x');
    expect(release()).toBe(2);
    expect(errors.mock.calls.at(-1)[0]).toMatch(/not clean/);
    rmSync(join(repo, 'stray.txt'));
    git(repo, 'checkout', '-q', '-b', 'side');
    write(join(repo, 'side.txt'), 'x');
    git(repo, 'add', '-A');
    git(repo, 'commit', '-q', '-m', 'side');
    expect(release({ options: { integration: 'local/main' } })).toBe(2);
    expect(errors.mock.calls.at(-1)[0]).toMatch(/not the tip of local\/main/);
    git(repo, 'checkout', '-q', 'local/main');
    git(repo, 'rm', '-q', '.changeset/tiny.md');
    git(repo, 'commit', '-q', '-m', 'drop changeset');
    expect(release()).toBe(2);
    expect(errors.mock.calls.at(-1)[0]).toMatch(/no pending changesets/);
    expect(calls).toEqual([]);
    expect(existsSync(join(home, 'releases'))).toBe(false);
  });
});

describe('E2 brock release --local', { tags: ['e2e'] }, () => {
  it('stops with exit 2 on a branch until the release note exists, then continues', () => {
    const errors = quiet();
    expect(release()).toBe(2);
    expect(errors.mock.calls.at(-1)[0]).toContain(join(repo, 'release-notes', 'v1.0.1.md'));
    expect(git(repo, 'rev-parse', '--abbrev-ref', 'HEAD')).toBe('release/local-1.0.1');
    expect(git(repo, 'log', '--format=%s', '-1')).toBe('release: version packages');
    expect(existsSync(join(home, 'releases'))).toBe(false);
    write(join(repo, 'release-notes/v1.0.1.md'), NOTE);
    expect(release()).toBe(0);
    expect(calls.filter((call) => call[1] === 'exec')).toHaveLength(1);
    expect(git(repo, 'log', '--format=%s', '-2', 'release/local-1.0.1')).toBe('docs: release notes v1.0.1\nrelease: version packages');
    expect(git(repo, 'rev-parse', '--abbrev-ref', 'HEAD')).toBe('local/main');
  });

  it('packs every changed public package into the store and writes release.json last', () => {
    quiet();
    write(join(repo, 'release-notes/v1.0.1.md'), NOTE);
    git(repo, 'add', '-A');
    git(repo, 'commit', '-q', '-m', 'notes');
    const extra = { extraAssets: ({ version }) => (write(join(root, 'extra.txt'), `extra ${version}`), [{ name: 'extra.txt', path: join(root, 'extra.txt'), kind: 'doc' }]) };
    expect(release(extra)).toBe(0);
    const dir = join(home, 'releases', 'atlas', 'latest', '1.0.1');
    expect(readdirSync(dir).sort()).toEqual(['atlas-a-1.0.1.tgz', 'atlas-b-1.0.1.tgz', 'extra.txt', 'notes.md', 'release.json']);
    expect(announced).toEqual([join(dir, 'release.json')]);
    const manifest = JSON.parse(readFileSync(join(dir, 'release.json'), 'utf8'));
    const commit = git(repo, 'rev-parse', 'release/local-1.0.1');
    expect(manifest).toMatchObject({ kind: 'release', project: 'atlas', channel: 'latest', version: '1.0.1', commit, notes: 'notes.md', replay: { state: 'pending', at: null, url: null } });
    expect(manifest.packages.map((pkg) => [pkg.name, pkg.version, pkg.tarball])).toEqual([['@atlas/a', '1.0.1', 'atlas-a-1.0.1.tgz'], ['@atlas/b', '1.0.1', 'atlas-b-1.0.1.tgz']]);
    for (const pkg of manifest.packages) {
      const bytes = readFileSync(join(dir, pkg.tarball));
      expect(pkg.sha512).toBe(createHash('sha512').update(bytes).digest('base64'));
      expect(pkg.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
      expect(pkg.size).toBe(bytes.length);
    }
    expect(manifest.assets).toMatchObject([{ name: 'extra.txt', kind: 'doc', size: 'extra 1.0.1'.length }]);
    expect(readFileSync(join(dir, 'notes.md'), 'utf8')).toContain('# Atlas v1.0.1');
    expect(readFileSync(join(dir, 'notes.md'), 'utf8')).not.toContain('@layer');
    const newest = Math.max(...readdirSync(dir).filter((name) => name !== 'release.json').map((name) => statSync(join(dir, name)).mtimeMs));
    expect(statSync(join(dir, 'release.json')).mtimeMs).toBeGreaterThanOrEqual(newest);
    expect(calls.filter((call) => call[0] === 'pnpm' && call[1] === 'pack')).toHaveLength(2);
  });

});

describe('E2 brock release --local and the board', { tags: ['e2e'] }, () => {
  it('opens the pull request record and does not merge', () => {
    quiet();
    write(join(repo, 'release-notes/v1.0.1.md'), NOTE);
    git(repo, 'add', '-A');
    git(repo, 'commit', '-q', '-m', 'notes');
    const tip = git(repo, 'rev-parse', 'local/main');
    expect(release()).toBe(0);
    const open = calls.find((call) => call[0] === 'coord');
    expect(open.slice(1, 8)).toEqual(['pr', 'open', 'release: v1.0.1', '--head', 'release/local-1.0.1', '--base', 'local/main']);
    expect(git(repo, 'rev-parse', 'local/main')).toBe(tip);
    expect(lines.join('\n')).toContain('PR-1 opened');
  });

  it('leaves no release.json when a step fails after the tarballs, and refuses a released version', () => {
    const errors = quiet();
    write(join(repo, 'release-notes/v1.0.1.md'), NOTE);
    git(repo, 'add', '-A');
    git(repo, 'commit', '-q', '-m', 'notes');
    const broken = { extraAssets: () => [{ name: 'gone.txt', path: join(root, 'missing.txt') }] };
    expect(() => release(broken)).toThrow(/ENOENT/);
    const dir = join(home, 'releases', 'atlas', 'latest', '1.0.1');
    expect(existsSync(join(dir, 'release.json'))).toBe(false);
    expect(readdirSync(dir).filter((name) => name.startsWith('.'))).toEqual([]);
    expect(git(repo, 'rev-parse', '--abbrev-ref', 'HEAD')).toBe('release/local-1.0.1');
    expect(release()).toBe(0);
    expect(existsSync(join(dir, 'release.json'))).toBe(true);
    git(repo, 'checkout', '-q', 'release/local-1.0.1');
    expect(release()).toBe(2);
    expect(errors.mock.calls.at(-1)[0]).toMatch(/already holds a release/);
  });
});
