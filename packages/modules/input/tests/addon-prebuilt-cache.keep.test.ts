/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cachedPrebuiltOf, storePrebuilt } from '../ensure-addon/index.mjs';
import { PLATFORM_ARCH, addonCacheFixture } from './addon-cache-fixture';

const fx = addonCacheFixture();
const cached = () => cachedPrebuiltOf(fx.asset(), PLATFORM_ARCH, process.env);

beforeEach(fx.setup);
afterEach(fx.teardown);

describe('K3 the cached addon prebuilt', { tags: ['standard'] }, () => {
  it('installs from the cache with no network on a hit, in either mode', async () => {
    expect(await storePrebuilt(fx.asset(), PLATFORM_ARCH, fx.state.archive, process.env)).toBe(true);
    const fetchStub = fx.blockNetwork();
    fx.setMode('local');
    expect(await fx.run()).toBe('installed');
    expect(readFileSync(fx.installedFile(), 'utf8')).toBe('addon bytes');
    expect(fx.state.logs.some((line) => line.includes('from the build cache'))).toBe(true);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('never fetches on a miss in local mode and falls back without failing', async () => {
    const fetchStub = fx.blockNetwork();
    fx.setMode('local');
    expect(await fx.run()).toBe('unavailable');
    expect(existsSync(fx.installedFile())).toBe(false);
    expect(fx.state.logs.filter((line) => line.includes('not cached and local mode forbids downloading'))).toHaveLength(1);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('treats a missing remote.json as local mode', async () => {
    const fetchStub = fx.blockNetwork();
    expect(await fx.run()).toBe('unavailable');
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('downloads and stores the archive on a miss in remote mode', async () => {
    const fetchStub = fx.stubGithub();
    fx.setMode('remote');
    expect(await fx.run()).toBe('installed');
    expect(fetchStub).toHaveBeenCalled();
    expect(readFileSync(fx.installedFile(), 'utf8')).toBe('addon bytes');
    expect(cached()).not.toBeNull();
  });

  it('reads a cached archive with a wrong sha256 as a miss', async () => {
    await storePrebuilt(fx.asset(), PLATFORM_ARCH, fx.state.archive, process.env);
    writeFileSync(cached() ?? '', 'tampered');
    expect(cached()).toBeNull();
    const offline = fx.blockNetwork();
    fx.setMode('local');
    expect(await fx.run()).toBe('unavailable');
    expect(offline).not.toHaveBeenCalled();
    fx.stubGithub();
    fx.setMode('remote');
    expect(await fx.run()).toBe('installed');
    expect(cached()).not.toBeNull();
  });
});
