/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const spawned = vi.hoisted(() => ({ calls: [] }));

vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal()),
  execFileSync: (file, args) => {
    spawned.calls.push([file, ...args]);
    return '';
  },
}));

const { ghLoud, tryGh } = await import('../src/gh.mjs');
const { git, gitLoud, tryGit } = await import('../src/git.mjs');
const { isLocalMode, remoteMode } = await import('../src/local/remote-mode.mjs');

let home = '';
let saved;

const setMode = (mode) => writeFileSync(join(home, 'remote.json'), JSON.stringify({ schema: 1, mode }));

beforeEach(() => {
  saved = process.env.COORD_HOME;
  home = mkdtempSync(join(tmpdir(), 'brock-mode-'));
  process.env.COORD_HOME = home;
  spawned.calls.length = 0;
});

afterEach(() => {
  if (saved === undefined) delete process.env.COORD_HOME;
  else process.env.COORD_HOME = saved;
  rmSync(home, { recursive: true, force: true });
});

describe('the mode switch', () => {
  it('is local when the file is missing, unreadable or odd', () => {
    expect(remoteMode()).toBe('local');
    writeFileSync(join(home, 'remote.json'), 'not json');
    expect(remoteMode()).toBe('local');
    setMode('sideways');
    expect(remoteMode()).toBe('local');
  });

  it('is remote only when the file says so', () => {
    setMode('remote');
    expect(remoteMode()).toBe('remote');
    expect(isLocalMode()).toBe(false);
  });

  it('keeps gh, fetch and push unused in local mode', () => {
    expect(tryGh(['pr', 'list'], '.')).toBeNull();
    expect(() => ghLoud(['pr', 'create'], '.')).toThrow(/local mode/);
    expect(tryGit(['fetch', 'origin'], '.')).toBeNull();
    expect(tryGit(['-c', 'core.longpaths=true', 'push', 'origin', 'x'], '.')).toBeNull();
    expect(() => git(['ls-remote', 'origin'], '.')).toThrow(/local mode/);
    gitLoud(['push', '--set-upstream', 'origin', 'x'], '.');
    expect(spawned.calls).toEqual([]);
  });

  it('calls gh and git again in remote mode, and still runs local git in local mode', () => {
    tryGit(['status'], '.');
    expect(spawned.calls).toEqual([['git', 'status']]);
    setMode('remote');
    tryGh(['pr', 'list'], '.');
    gitLoud(['fetch', 'origin'], '.');
    expect(spawned.calls.map((call) => call.slice(0, 2))).toEqual([['git', 'status'], ['gh', 'pr'], ['git', 'fetch']]);
  });
});
