/* @layer tooling-scripts @kind test */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeRelease, makeRemote, mutating, pr, useReplayWorld } from './replay-fixture.mjs';

const t = useReplayWorld();

const PRS = [
  pr(2, '2026-10-29T12:00:00Z'),
  pr(1, '2026-10-29T10:00:00Z'),
  pr(3, '2026-10-29T13:00:00Z', { replay: { state: 'done', at: 'x', url: 'y' } }),
  pr(4, '2026-10-29T14:00:00Z', { status: 'open' }),
];

const { verb, setMode } = t;

const manifest = (release) => JSON.parse(readFileSync(join(release.dir, 'release.json'), 'utf8'));

describe('replay plan', () => {
  it('lists base push, merged PRs, then releases oldest first, and runs nothing', () => {
    makeRelease({ home: t.world.home, version: '1.1.0', createdAt: '2026-10-29T11:00:00Z' });
    makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: PRS });
    expect(verb('plan', {}, remote)).toBe(0);
    const titles = t.lines.filter((line) => /^\d+\. /.test(line));
    expect(titles.map((line) => line.replace(/^(\d+)\. (\S+ \S+).*$/, '$1 $2'))).toEqual([
      '1 Open a',
      '2 Open a',
      '3 Push local/main',
      '4 Publish v1.0.0',
      '5 Publish v1.1.0',
    ]);
    expect(titles[0]).toContain('PR-1');
    expect(titles[1]).toContain('PR-2');
    expect(t.lines.join('\n')).toContain('merged locally as PR-1 at 1f1f');
    expect(t.lines.join('\n')).toContain('npm publish');
    expect(t.lines.join('\n')).toContain('--registry https://npm.example.test');
    expect(mutating(remote.state.calls)).toEqual([]);
  });

  it('prints json and works in local mode', () => {
    setMode('local');
    makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: PRS });
    expect(verb('plan', { json: true }, remote)).toBe(0);
    const plan = JSON.parse(t.lines.join('\n'));
    expect(plan.map((item) => item.kind)).toEqual(['pr', 'pr', 'push-base', 'release']);
  });

  it('flags a base that is not a fast-forward of origin', () => {
    const remote = makeRemote({ prs: [], notFastForward: true });
    verb('plan', {}, remote);
    expect(t.lines.join('\n')).toContain('BLOCKED: local/main');
    expect(t.lines.join('\n')).toContain('not a fast-forward');
  });
});

describe('replay run guards', () => {
  it.each([['local'], [null]])('refuses in local mode (%s)', (mode) => {
    if (mode) setMode(mode);
    const remote = makeRemote({ prs: PRS });
    expect(verb('run', { go: true }, remote)).toBe(2);
    expect(t.errors.join('\n')).toContain("replay waits for the owner's go: coord remote remote");
    expect(remote.state.calls).toEqual([]);
  });

  it('refuses without --go', () => {
    setMode('remote');
    const remote = makeRemote({ prs: PRS });
    expect(verb('run', {}, remote)).toBe(2);
    expect(t.errors.join('\n')).toContain('--go');
    expect(remote.state.calls).toEqual([]);
  });

  it('stops when the base is not a fast-forward, before any push', () => {
    setMode('remote');
    const remote = makeRemote({ prs: PRS, notFastForward: true });
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(mutating(remote.state.calls)).toEqual([]);
  });

  it('stops on a sha mismatch before anything is sent', () => {
    setMode('remote');
    const release = makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    writeFileSync(join(release.dir, release.tarball), 'tampered');
    const remote = makeRemote({ prs: PRS });
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(t.errors.join('\n')).toContain('does not match the sha512');
    expect(mutating(remote.state.calls)).toEqual([]);
  });
});

describe('replay run', () => {
  beforeEach(() => setMode('remote'));

  it('runs the plan in order, records the release, and skips done items on a rerun', () => {
    const release = makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: PRS });
    expect(verb('run', { go: true }, remote)).toBe(0);
    expect(mutating(remote.state.calls).map((call) => call.slice(0, 3).join(' '))).toEqual([
      'git push origin',
      'gh pr create',
      'git push origin',
      'gh pr create',
      'git push origin',
      `npm publish ${join(release.dir, release.tarball)}`,
      'gh release create',
    ]);
    const after = manifest(release);
    expect(after.replay.state).toBe('done');
    expect(after.replay.url).toBe('https://github.test/releases/v1.0.0');
    expect(after.packages[0].sha512).toBe(release.sha512);
    expect(readdirSync(release.dir).filter((name) => name.endsWith('.tmp'))).toEqual([]);
    expect(t.lines.join('\n')).toContain('coord pr has no verb to set replay yet. Record on PR-1');
    remote.state.calls.length = 0;
    expect(verb('run', { go: true }, remote)).toBe(0);
    expect(mutating(remote.state.calls)).toEqual([]);
  });

  it('marks a version done when the registry holds the same integrity', () => {
    const release = makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: [] });
    remote.state.published['@acme/atlas@1.0.0'] = `sha512-${release.sha512}`;
    expect(verb('run', { go: true }, remote)).toBe(0);
    expect(remote.state.calls.some((call) => call[0] === 'npm' && call[1] === 'publish')).toBe(false);
    expect(manifest(release).replay.state).toBe('done');
  });

  it('hard stops on a different integrity and records the failure', () => {
    const release = makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: [] });
    remote.state.published['@acme/atlas@1.0.0'] = 'sha512-other';
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(t.errors.join('\n')).toContain('different integrity');
    expect(remote.state.calls.some((call) => call[0] === 'gh' && call[2] === 'create' && call[1] === 'release')).toBe(false);
    expect(manifest(release).replay.state).toBe('failed');
  });

  it('stops at the first failure and runs nothing after it', () => {
    makeRelease({ home: t.world.home, version: '1.0.0', createdAt: '2026-10-29T09:00:00Z' });
    const remote = makeRemote({ prs: PRS, failOn: 'pr create --head feat/change-1' });
    expect(verb('run', { go: true }, remote)).toBe(1);
    expect(remote.state.calls.some((call) => call[0] === 'npm')).toBe(false);
    expect(remote.state.calls.some((call) => call[2] === 'local/main:refs/heads/main')).toBe(false);
    expect(t.lines.join('\n')).toContain('Record on PR-1: replay {"state":"failed"');
    expect(remote.state.origin).toBe('b'.repeat(40));
  });
});
