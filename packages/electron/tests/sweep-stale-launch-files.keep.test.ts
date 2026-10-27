/* @layer electron-main @kind test */
import { existsSync, mkdirSync, utimesSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { sweepStaleLaunchFiles } from '../src/main/bridge/sweep-stale-launch-files';
import { closeOpened, tempDir } from './bridge-fixture';

afterEach(() => {
  closeOpened();
});

const NOW = Date.now();
const OLD = new Date(NOW - 3_600_000);
const KEY = 'data-0123456789ab';

const launchWith = (dir: string, name: string, args: string[], when: Date = OLD): string => {
  const file = join(dir, name);
  writeFileSync(file, JSON.stringify({ command: process.execPath, args, env: {} }));
  utimesSync(file, when, when);
  return file;
};

const folder = (): string => {
  const dir = join(tempDir(), 'bxel');
  mkdirSync(dir, { recursive: true });
  return dir;
};

describe('sweepStaleLaunchFiles', () => {
  it('removes an old profile launch file whose profile folder is gone', async () => {
    const dir = folder();
    const file = launchWith(dir, `launch-bridge.${KEY}.json`, [`--user-data=${join(dir, 'gone')}`]);
    expect(await sweepStaleLaunchFiles(join(dir, 'bridge.json'), NOW)).toBe(1);
    expect(existsSync(file)).toBe(false);
  });

  it('removes an old profile launch file that names no profile', async () => {
    const dir = folder();
    const file = launchWith(dir, `launch-bridge.${KEY}.json`, []);
    await sweepStaleLaunchFiles(join(dir, 'bridge.json'), NOW);
    expect(existsSync(file)).toBe(false);
  });

  it('keeps a launch file whose profile folder still exists', async () => {
    const dir = folder();
    const profile = join(dir, 'profile');
    mkdirSync(profile);
    const file = launchWith(dir, `launch-bridge.${KEY}.json`, [`--user-data=${profile}`]);
    expect(await sweepStaleLaunchFiles(join(dir, 'bridge.json'), NOW)).toBe(0);
    expect(existsSync(file)).toBe(true);
  });

  it('keeps a launch file that is recent or whose instance is running', async () => {
    const dir = folder();
    const gone = [`--user-data=${join(dir, 'gone')}`];
    const recent = launchWith(dir, `launch-bridge.${KEY}.json`, gone, new Date(NOW - 1_000));
    const live = launchWith(dir, 'launch-bridge.data-aaaaaaaaaaaa.json', gone);
    writeFileSync(join(dir, 'bridge.data-aaaaaaaaaaaa.json'), '{}');
    expect(await sweepStaleLaunchFiles(join(dir, 'bridge.json'), NOW)).toBe(0);
    expect(existsSync(recent)).toBe(true);
    expect(existsSync(live)).toBe(true);
  });

  it('only touches names of the exact profile launch pattern', async () => {
    const dir = folder();
    const gone = [`--user-data=${join(dir, 'gone')}`];
    const keep = [
      launchWith(dir, 'launch-bridge.json', gone),
      launchWith(dir, 'launch-bridge.sprite.json', gone),
      launchWith(dir, 'launch-bridge.data-xyz.json', gone),
      launchWith(dir, `launch-bridge.${KEY}.json.tmp`, gone),
      launchWith(dir, `other.${KEY}.json`, gone),
    ];
    expect(await sweepStaleLaunchFiles(join(dir, 'bridge.json'), NOW)).toBe(0);
    for (const file of keep) expect(existsSync(file)).toBe(true);
  });
});
