/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PLATFORM_ARCH, addonCacheFixture } from './addon-cache-fixture';

const fx = addonCacheFixture();
const entryDir = () => join(fx.state.work, 'cache', 'addon-installed', fx.asset().name, fx.asset().tag, PLATFORM_ARCH);
const entryFile = () => join(entryDir(), 'files', 'sdl3_input.node');
const dropCache = (): void => rmSync(join(fx.state.work, 'cache'), { recursive: true, force: true });

const installRemotely = async (): Promise<void> => {
  fx.stubGithub();
  fx.setMode('remote');
  expect(await fx.run()).toBe('installed');
};

const startFreshLocalWorktree = (): void => {
  rmSync(join(fx.state.work, 'cache', 'addon-prebuilt'), { recursive: true, force: true });
  fx.state.packageDir = fx.newPackage('worktree-two');
  fx.state.logs = [];
  fx.setMode('local');
};

beforeEach(fx.setup);
afterEach(fx.teardown);

describe('K3 the cached installed addon', { tags: ['standard'] }, () => {
  it('stores the extracted files after a download', async () => {
    await installRemotely();
    expect(readFileSync(entryFile(), 'utf8')).toBe('addon bytes');
    const manifest = JSON.parse(readFileSync(join(entryDir(), 'manifest.json'), 'utf8')) as { files: Record<string, string>; source: string };
    expect(manifest.files['sdl3_input.node']).toBe(createHash('sha256').update('addon bytes').digest('hex'));
    expect(manifest.source).toBe('prebuilt');
  });

  it('restores a fresh local worktree with no fetch when the archive is not cached', async () => {
    await installRemotely();
    startFreshLocalWorktree();
    const fetchStub = fx.blockNetwork();
    expect(await fx.run()).toBe('installed');
    expect(readFileSync(fx.installedFile(), 'utf8')).toBe('addon bytes');
    expect(fx.state.logs.some((line) => line.includes('Restored the installed'))).toBe(true);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('reads a file with a bad sha256 as a miss', async () => {
    await installRemotely();
    writeFileSync(entryFile(), 'tampered');
    startFreshLocalWorktree();
    const fetchStub = fx.blockNetwork();
    expect(await fx.run()).toBe('unavailable');
    expect(existsSync(fx.installedFile())).toBe(false);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('stores an addon already on disk when its marker matches the pins', async () => {
    await installRemotely();
    dropCache();
    expect(existsSync(entryDir())).toBe(false);
    expect(await fx.run()).toBe('current');
    expect(readFileSync(entryFile(), 'utf8')).toBe('addon bytes');
  });

  it('never stores an addon whose marker does not match the pins', async () => {
    await installRemotely();
    dropCache();
    writeFileSync(join(fx.state.packageDir, 'native', 'package.json'), JSON.stringify({ version: '9.9.9', sdl3: '2.0.0', libusb: '1.0.0' }));
    fx.setMode('local');
    expect(await fx.run()).toBe('kept');
    expect(existsSync(join(fx.state.work, 'cache', 'addon-installed'))).toBe(false);
  });
});
