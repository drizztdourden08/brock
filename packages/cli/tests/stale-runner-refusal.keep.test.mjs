/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { localModeOn } from '../src/local-mode.mjs';
import { runnerPackage } from '../src/runner-package.mjs';
import { staleRunnerRefusal } from '../src/stale-runner-refusal.mjs';

const made = [];
const THREAD = '@drizztdourden08/brock-thread';

const folder = () => {
  const dir = mkdtempSync(join(tmpdir(), 'cli-stale-'));
  made.push(dir);
  return dir;
};

const write = (file, text) => {
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, text);
};

const threadPackage = (dir, withLocal) => {
  write(join(dir, 'package.json'), JSON.stringify({ name: THREAD, version: '0.116.0' }));
  write(join(dir, 'bin', 'brock-thread.mjs'), '');
  if (withLocal) write(join(dir, 'src', 'local', 'remote-mode.mjs'), '');
  return join(dir, 'bin', 'brock-thread.mjs');
};

const staleBuild = () => {
  const dir = folder();
  write(join(dir, 'package.json'), JSON.stringify({ name: '@drizztdourden08/brock-build', version: '0.1.0' }));
  write(join(dir, 'bin', 'brock.mjs'), '');
  const thread = join(dir, 'node_modules', THREAD);
  write(join(thread, 'package.json'), JSON.stringify({ name: THREAD, version: '0.1.0', main: 'bin/brock-thread.mjs' }));
  write(join(thread, 'bin', 'brock-thread.mjs'), '');
  return join(dir, 'bin', 'brock.mjs');
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('K5 local mode with a stale runner', { tags: ['critical'] }, () => {
  it('reads the coord switch like brock-thread: local unless it says remote', () => {
    const home = folder();
    expect(localModeOn({ COORD_HOME: home })).toBe(true);
    write(join(home, 'remote.json'), JSON.stringify({ mode: 'remote' }));
    expect(localModeOn({ COORD_HOME: home })).toBe(false);
    write(join(home, 'remote.json'), JSON.stringify({ mode: 'local' }));
    expect(localModeOn({ COORD_HOME: home })).toBe(true);
    write(join(home, 'remote.json'), 'not json');
    expect(localModeOn({ COORD_HOME: home })).toBe(true);
  });

  it('knows a thread package with local mode from one without', () => {
    expect(runnerPackage(threadPackage(folder(), true)).hasLocalMode).toBe(true);
    expect(runnerPackage(threadPackage(folder(), false))).toEqual({ label: 'brock-thread 0.116.0', hasLocalMode: false });
  });

  it('counts a brock-build whose brock-thread has no local mode as stale', () => {
    expect(runnerPackage(staleBuild())).toEqual({ label: 'brock-build 0.1.0', hasLocalMode: false });
  });

  it('refuses a GitHub verb on a stale runner in local mode and names version and fix', () => {
    const line = staleRunnerRefusal('release', true, staleBuild());
    expect(line).toContain('brock-build 0.1.0');
    expect(line).toContain('npm install -g @drizztdourden08/brock');
    expect(line.trim().split('\n')).toHaveLength(1);
    for (const verb of ['pr', 'replay', 'publish']) expect(staleRunnerRefusal(verb, true, staleBuild())).not.toBeNull();
  });

  it('lets a runner with local mode, a remote switch or a local verb through', () => {
    expect(staleRunnerRefusal('release', true, threadPackage(folder(), true))).toBeNull();
    expect(staleRunnerRefusal('release', false, staleBuild())).toBeNull();
    expect(staleRunnerRefusal('lint', true, staleBuild())).toBeNull();
  });
});
