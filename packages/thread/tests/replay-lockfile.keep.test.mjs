/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeRelease, makeRemote, mutating, pr, useReplayWorld, write } from './replay-fixture.mjs';

const t = useReplayWorld({ LOCALPKG_BIN: 'localpkg.mjs' });

const COMMIT = 'd'.repeat(40);
const CLEAN_LOCK = "lockfileVersion: '9.0'\nimporters:\n  .:\n    dependencies:\n      '@acme/lib':\n        version: 2.0.0\n";
const PRS = [pr(1, '2026-10-29T10:00:00Z')];

const { verb, setMode } = t;

const consumerRemote = ({ onRegistry = true, prs = PRS } = {}) => {
  const remote = makeRemote({ prs });
  const root = t.world.repo.replace(/\\/g, '/');
  remote.state.status = JSON.stringify({ builds: [{ name: '@acme/lib', version: '2.0.0' }], consumers: [{ root }] });
  remote.state.lockText = CLEAN_LOCK;
  if (onRegistry) remote.state.published['@acme/lib@2.0.0'] = '2.0.0';
  write(join(t.world.repo, 'package.json'), JSON.stringify({ name: 'app', dependencies: { '@acme/lib': '^2.0.0' } }));
  return remote;
};

const withBadCommit = (remote, lock) => {
  remote.state.commits = [COMMIT];
  remote.state.files[COMMIT] = 'src/a.ts\npnpm-lock.yaml';
  remote.state.blobs[`${COMMIT}:pnpm-lock.yaml`] = lock;
  return remote;
};

const sequence = (remote) => remote.state.calls.map((call) => call.join(' '));

const indexOfCall = (calls, prefix) => calls.findIndex((call) => call.startsWith(prefix));

describe('replay plan lockfile step', () => {
  it('lists the lockfile step first for a localpkg consumer and runs nothing', () => {
    makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = consumerRemote();
    expect(verb('plan', { json: true }, remote)).toBe(0);
    const plan = JSON.parse(t.lines.join('\n'));
    expect(plan.map((item) => item.kind)).toEqual(['lockfile', 'pr', 'push-base', 'release']);
    expect(plan[0].blocked).toBeUndefined();
    expect(plan[0].commands).toContain('npm view @acme/lib@2.0.0 version --registry https://npm.example.test');
    expect(plan[0].commands).toContain('pnpm install --no-frozen-lockfile');
    expect(plan[0].commands.some((command) => command.includes('localpkg.mjs off'))).toBe(true);
    expect(mutating(remote.state.calls)).toEqual([]);
    expect(sequence(remote).some((call) => call.includes('pnpm') || call.includes(' off '))).toBe(false);
  });

  it('adds no step to a repo with no localpkg work', () => {
    const remote = makeRemote({ prs: PRS });
    verb('plan', { json: true }, remote);
    expect(JSON.parse(t.lines.join('\n')).map((item) => item.kind)).toEqual(['pr', 'push-base']);
  });

  it('is BLOCKED while a needed version is not on the registry', () => {
    const remote = consumerRemote({ onRegistry: false });
    verb('plan', {}, remote);
    expect(t.lines.join('\n')).toContain('BLOCKED: @acme/lib@2.0.0 not on the registry yet');
  });

  it('stops the run before the first command when it is BLOCKED', () => {
    setMode('remote');
    const remote = consumerRemote({ onRegistry: false });
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(t.errors.join('\n')).toContain('@acme/lib@2.0.0');
    expect(sequence(remote).some((call) => call.startsWith('pnpm') || call.includes(' off '))).toBe(false);
    expect(mutating(remote.state.calls)).toEqual([]);
  });
});

describe('replay lockfile step without the localpkg binary', () => {
  const blindRemote = () => {
    vi.stubEnv('LOCALPKG_BIN', '');
    return makeRemote({ prs: PRS, failOn: 'localpkg' });
  };

  const consumerBySignal = {
    'the consumers file': () => write(join(t.world.home, 'localpkg', 'consumers.json'), JSON.stringify({ [t.world.repo.replace(/[\\]/g, '/')]: { since: 'x' } })),
    'the generated pnpmfile': () => write(join(t.world.repo, '.pnpmfile.cjs'), '// localpkg: generated\nmodule.exports = {};\n'),
  };

  it.each(Object.keys(consumerBySignal))('shows the step BLOCKED, not absent, for a consumer found by %s', (signal) => {
    consumerBySignal[signal]();
    const remote = blindRemote();
    expect(verb('plan', { json: true }, remote)).toBe(0);
    const plan = JSON.parse(t.lines.join('\n'));
    expect(plan.map((item) => item.kind)).toEqual(['lockfile', 'pr', 'push-base']);
    expect(plan[0].blocked).toContain('LOCALPKG_BIN');
  });

  it('stops the run before any command', () => {
    setMode('remote');
    consumerBySignal['the generated pnpmfile']();
    const remote = blindRemote();
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(t.errors.join('\n')).toContain('LOCALPKG_BIN');
    expect(sequence(remote).some((call) => call.startsWith('pnpm'))).toBe(false);
    expect(mutating(remote.state.calls)).toEqual([]);
  });
});

describe('replay run lockfile step', () => {
  beforeEach(() => setMode('remote'));

  it('runs off, install, verify and commit in order, then pushes', () => {
    const remote = consumerRemote();
    expect(verb('run', { go: true }, remote)).toBe(0);
    const calls = sequence(remote);
    const order = ['node localpkg.mjs off', 'pnpm install --no-frozen-lockfile', 'git status --porcelain', 'git add -- pnpm-lock.yaml', 'git commit -m chore: lockfile for the replayed versions', 'git push'];
    const at = order.map((prefix) => indexOfCall(calls, prefix));
    expect(at.every((index) => index >= 0)).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(calls[at[0]]).toContain('--no-install');
    expect(readFileSync(join(t.world.repo, 'pnpm-lock.yaml'), 'utf8')).toBe(CLEAN_LOCK);
    expect(remote.state.origin).toBe('a'.repeat(40));
  });

  it('commits nothing when the lockfile did not change', () => {
    const remote = consumerRemote();
    remote.state.lockDirty = false;
    expect(verb('run', { go: true }, remote)).toBe(0);
    expect(sequence(remote).some((call) => call.startsWith('git commit'))).toBe(false);
  });

  it('refuses a regenerated lockfile that still points at localpkg', () => {
    const remote = consumerRemote();
    remote.state.lockText = 'tarball: file:C:/Users/x/.coord/localpkg/tarballs/lib.tgz\n';
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(sequence(remote).some((call) => call.startsWith('git commit'))).toBe(false);
    expect(mutating(remote.state.calls)).toEqual([]);
  });

  it('refuses to commit the lockfile on another branch', () => {
    const remote = consumerRemote();
    remote.state.branch = 'feat/other';
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(sequence(remote).some((call) => call.startsWith('pnpm'))).toBe(false);
  });
});

describe('replay lockfile guard', () => {
  const BAD = [
    ['.coord/localpkg', "tarball: 'file:C:/Users/x/.coord/localpkg/tarballs/lib.tgz'\n"],
    ['.coord/localpkg', 'resolution: C:\\Users\\x\\.coord\\localpkg\\lib.tgz\n'],
    ['an outside file: path', "'@acme/lib': file:../../elsewhere/lib\n"],
    ['an outside file: path', 'version: file:D:/other/lib.tgz\n'],
  ];

  it.each(BAD)('plan marks a commit holding %s BLOCKED', (_name, lock) => {
    const remote = withBadCommit(makeRemote({ prs: PRS }), lock);
    verb('plan', {}, remote);
    expect(t.lines.join('\n')).toContain(`BLOCKED: commit ${COMMIT.slice(0, 9)} holds`);
    expect(t.lines.join('\n')).toContain('in pnpm-lock.yaml');
  });

  it.each(BAD)('run refuses a commit holding %s and names commit and file', (_name, lock) => {
    setMode('remote');
    const remote = withBadCommit(makeRemote({ prs: PRS }), lock);
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(t.errors.join('\n')).toContain(COMMIT.slice(0, 9));
    expect(t.errors.join('\n')).toContain('pnpm-lock.yaml');
    expect(mutating(remote.state.calls)).toEqual([]);
  });

  it('accepts workspace link: and in-repo file: paths', () => {
    setMode('remote');
    const inside = `${t.world.repo.replace(/\\/g, '/')}/packages/c`;
    const lock = `a: link:packages/a\nb: file:packages/b\nc: file:${inside}\nd: link:../shared\nprofile: x\n`;
    const remote = withBadCommit(makeRemote({ prs: PRS }), lock);
    expect(verb('run', { go: true }, remote)).toBe(0);
    expect(remote.state.origin).toBe('a'.repeat(40));
  });
});
