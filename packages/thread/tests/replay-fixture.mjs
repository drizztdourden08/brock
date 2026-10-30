/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, vi } from 'vitest';
import { digestOf } from '../src/release/local/release-store.mjs';
import { replayVerb } from '../src/replay/replay-verb.mjs';

const LOCAL = 'a'.repeat(40);
const ORIGIN = 'b'.repeat(40);
const MUTATING = new Set(['push', 'publish', 'create']);

const write = (file, text) => {
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, text);
};

const pr = (n, mergedAt, extra = {}) => ({
  id: `PR-${n}`,
  title: `change ${n}`,
  head: `feat/change-${n}`,
  base: 'local/main',
  headCommit: String(n).repeat(40),
  status: 'merged',
  mergeCommit: `${n}f`.repeat(20),
  mergedAt,
  replay: { state: 'pending', at: null, url: null },
  ...extra,
});

const makeRelease = ({ home, version, createdAt, replay }) => {
  const dir = join(home, 'releases', 'atlas', 'latest', version);
  const tarball = `acme-atlas-${version}.tgz`;
  write(join(dir, tarball), `bytes of acme atlas ${version}`);
  write(join(dir, 'notes.md'), `# atlas v${version}\n`);
  write(join(dir, 'atlas-setup.exe'), `installer ${version}`);
  const { sha512, sha256, size } = digestOf(join(dir, tarball));
  const manifest = {
    kind: 'release',
    project: 'atlas',
    channel: 'latest',
    version,
    tag: `v${version}`,
    title: `atlas v${version}`,
    commit: 'c'.repeat(40),
    createdAt,
    notes: 'notes.md',
    packages: [{ name: '@acme/atlas', version, tarball, sha512, sha256, size }],
    assets: [{ name: 'atlas-setup.exe', path: 'atlas-setup.exe', kind: 'installer' }],
    replay: replay ?? { state: 'pending', at: null, url: null },
  };
  write(join(dir, 'release.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return { dir, tarball, sha512 };
};

const makeWorld = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-replay-'));
  const home = join(root, 'coord');
  const repo = join(root, 'repo');
  write(join(repo, '.npmrc'), '@acme:registry=https://npm.example.test\n');
  return { root, home, repo };
};

const notFound = () => {
  throw new Error('not found');
};

const publishedKey = (file) => `@acme/atlas@${/atlas-(.+)\.tgz$/.exec(file)[1]}`;

const localHandlers = (state) => [
  ['node', (args) => (args[1] === 'status' ? (state.status ?? notFound()) : '')],
  ['pnpm install', (_args, opts) => write(join(opts.cwd, 'pnpm-lock.yaml'), state.lockText)],
  ['git log', () => state.commits.join('\n')],
  ['git diff-tree', (args) => state.files[args.at(-1)] ?? ''],
  ['git show', (args) => state.blobs[args[1]] ?? notFound()],
  ['git status', () => (state.lockDirty ? ' M pnpm-lock.yaml' : '')],
  ['git rev-parse --abbrev-ref', () => state.branch],
];

const handlersOf = (state, { prs, notFastForward }) => [
  ...localHandlers(state),
  ['coord', () => JSON.stringify(prs)],
  ['git rev-parse', (args) => (args[3].startsWith('origin') ? state.origin : LOCAL)],
  ['git merge-base', () => (notFastForward ? notFound() : '')],
  ['git push', (args) => (args[2].startsWith('local/main') ? (state.origin = LOCAL) : '')],
  ['npm view', (args) => state.published[args[1]] ?? notFound()],
  ['npm publish', (args) => (state.published[publishedKey(args[1])] = `sha512-${digestOf(args[1]).sha512}`)],
  ['gh pr list', (args) => state.prUrls[args[3]] ?? ''],
  ['gh pr create', (args) => (state.prUrls[args[3]] = `https://github.test/pull/${args[3]}\n`)],
  ['gh release view', (args) => state.releaseUrls[args[2]] ?? notFound()],
  ['gh release create', (args) => (state.releaseUrls[args[2]] = `https://github.test/releases/${args[2]}\n`)],
];

const makeRemote = ({ prs, notFastForward = false, failOn = null }) => {
  const state = { calls: [], origin: ORIGIN, published: {}, prUrls: {}, releaseUrls: {}, commits: [], files: {}, blobs: {}, branch: 'local/main', lockDirty: true, lockText: '' };
  const handlers = handlersOf(state, { prs, notFastForward });
  const exec = (command, args, opts = {}) => {
    state.calls.push([command, ...args]);
    const line = [command, ...args].join(' ');
    if (failOn && line.includes(failOn)) throw new Error(`stub failure: ${line}`);
    const found = handlers.find(([prefix]) => line.startsWith(prefix));
    return found ? found[1](args, opts) : '';
  };
  return { state, exec };
};

const mutating = (calls) => calls.filter((call) => call.some((word) => MUTATING.has(word)) && call[0] !== 'coord');

const useReplayWorld = (env = {}) => {
  const t = { world: null, lines: [], errors: [] };
  t.verb = (sub, options, remote) =>
    replayVerb.run([sub], options, { rootDir: t.world.repo, workspace: { name: 'atlas', base: 'main' }, log: (line) => t.lines.push(line), exec: remote.exec });
  t.setMode = (mode) => write(join(t.world.home, 'remote.json'), JSON.stringify({ mode }));
  beforeEach(() => {
    Object.assign(t, { world: makeWorld(), lines: [], errors: [] });
    vi.stubEnv('COORD_HOME', t.world.home);
    vi.stubEnv('COORD_PROJECT', 'atlas');
    for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
    vi.spyOn(console, 'error').mockImplementation((line) => t.errors.push(line));
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    rmSync(t.world.root, { recursive: true, force: true });
  });
  return t;
};

export { makeRelease, makeRemote, mutating, pr, useReplayWorld, write };
