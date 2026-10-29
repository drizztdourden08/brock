/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cachedPrebuiltOf, ensureAddon, prebuiltAssetOf, readPins, storePrebuilt } from '../ensure-addon/index.mjs';

const PLATFORM_ARCH = `${process.platform}-${process.arch}`;
const made: string[] = [];
let work = '';
let packageDir = '';
let archive = '';
let logs: string[] = [];

const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-prebuilt-'));
  made.push(dir);
  return dir;
};

const makeArchive = (): string => {
  const source = join(work, 'source');
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, 'sdl3_input.node'), 'addon bytes');
  execFileSync('tar', ['-czf', 'prebuilt.tar.gz', '-C', 'source', '.'], { cwd: work });
  return join(work, 'prebuilt.tar.gz');
};

const setMode = (mode: string): void => writeFileSync(join(work, 'coord', 'remote.json'), JSON.stringify({ mode }));

const run = () => ensureAddon({ packageDir, mode: 'postinstall', env: process.env, log: (line) => logs.push(line) });

const stubGithub = () => {
  const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
  const fetchStub = vi.fn((url: string, init?: { method?: string }) => {
    if (init?.method === 'HEAD') return Promise.resolve(new Response(null, { status: 200 }));
    if (url.endsWith('.sha256')) return Promise.resolve(new Response(`${digest}  prebuilt.tar.gz`));
    return Promise.resolve(new Response(readFileSync(archive)));
  });
  vi.stubGlobal('fetch', fetchStub);
  return fetchStub;
};

const asset = () => prebuiltAssetOf(readPins(join(packageDir, 'native')), PLATFORM_ARCH);
const installedFile = () => join(packageDir, 'native', 'prebuilds', PLATFORM_ARCH, 'sdl3_input.node');

beforeEach(() => {
  work = tempDir();
  packageDir = join(work, 'pkg');
  mkdirSync(join(packageDir, 'native'), { recursive: true });
  mkdirSync(join(work, 'coord'));
  writeFileSync(join(packageDir, 'native', 'package.json'), JSON.stringify({ version: '9.9.9', sdl3: '1.0.0', libusb: '1.0.0' }));
  vi.stubEnv('BROCK_BUILD_CACHE_DIR', join(work, 'cache'));
  vi.stubEnv('COORD_HOME', join(work, 'coord'));
  vi.stubEnv('GITHUB_ACTIONS', '');
  vi.stubEnv('CI', '');
  archive = makeArchive();
  logs = [];
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('the cached addon prebuilt', () => {
  it('installs from the cache with no network on a hit, in either mode', async () => {
    expect(await storePrebuilt(asset(), PLATFORM_ARCH, archive, process.env)).toBe(true);
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    setMode('local');
    expect(await run()).toBe('installed');
    expect(readFileSync(installedFile(), 'utf8')).toBe('addon bytes');
    expect(logs.some((line) => line.includes('from the build cache'))).toBe(true);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('never fetches on a miss in local mode and falls back without failing', async () => {
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    setMode('local');
    expect(await run()).toBe('unavailable');
    expect(existsSync(installedFile())).toBe(false);
    expect(logs.filter((line) => line.includes('not cached and local mode forbids downloading'))).toHaveLength(1);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('treats a missing remote.json as local mode', async () => {
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    expect(await run()).toBe('unavailable');
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('downloads and stores the archive on a miss in remote mode', async () => {
    const fetchStub = stubGithub();
    setMode('remote');
    expect(await run()).toBe('installed');
    expect(fetchStub).toHaveBeenCalled();
    expect(readFileSync(installedFile(), 'utf8')).toBe('addon bytes');
    expect(cachedPrebuiltOf(asset(), PLATFORM_ARCH, process.env)).not.toBeNull();
  });

  it('reads a cached archive with a wrong sha256 as a miss', async () => {
    await storePrebuilt(asset(), PLATFORM_ARCH, archive, process.env);
    const cached = cachedPrebuiltOf(asset(), PLATFORM_ARCH, process.env) ?? '';
    writeFileSync(cached, 'tampered');
    expect(cachedPrebuiltOf(asset(), PLATFORM_ARCH, process.env)).toBeNull();
    const offline = vi.fn();
    vi.stubGlobal('fetch', offline);
    setMode('local');
    expect(await run()).toBe('unavailable');
    expect(offline).not.toHaveBeenCalled();
    vi.stubGlobal('fetch', stubGithub());
    setMode('remote');
    expect(await run()).toBe('installed');
    expect(cachedPrebuiltOf(asset(), PLATFORM_ARCH, process.env)).not.toBeNull();
  });
});
