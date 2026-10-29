/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureAddon, prebuiltAssetOf, readPins } from '../ensure-addon/index.mjs';

const PLATFORM_ARCH = `${process.platform}-${process.arch}`;
const PINS = JSON.stringify({ version: '9.9.9', sdl3: '1.0.0', libusb: '1.0.0' });
const made: string[] = [];
let work = '';
let packageDir = '';
let archive = '';
let logs: string[] = [];

const newPackage = (name: string): string => {
  const dir = join(work, name);
  mkdirSync(join(dir, 'native'), { recursive: true });
  writeFileSync(join(dir, 'native', 'package.json'), PINS);
  return dir;
};

const makeArchive = (): string => {
  mkdirSync(join(work, 'source'), { recursive: true });
  writeFileSync(join(work, 'source', 'sdl3_input.node'), 'addon bytes');
  execFileSync('tar', ['-czf', 'prebuilt.tar.gz', '-C', 'source', '.'], { cwd: work });
  return join(work, 'prebuilt.tar.gz');
};

const setMode = (mode: string): void => writeFileSync(join(work, 'coord', 'remote.json'), JSON.stringify({ mode }));
const run = () => ensureAddon({ packageDir, mode: 'postinstall', env: process.env, log: (line) => logs.push(line) });

const stubGithub = (): void => {
  const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
  vi.stubGlobal('fetch', vi.fn((url: string, init?: { method?: string }) => {
    if (init?.method === 'HEAD') return Promise.resolve(new Response(null, { status: 200 }));
    if (url.endsWith('.sha256')) return Promise.resolve(new Response(`${digest}  prebuilt.tar.gz`));
    return Promise.resolve(new Response(readFileSync(archive)));
  }));
};

const asset = () => prebuiltAssetOf(readPins(join(packageDir, 'native')), PLATFORM_ARCH);
const installedFile = () => join(packageDir, 'native', 'prebuilds', PLATFORM_ARCH, 'sdl3_input.node');
const entryDir = () => join(work, 'cache', 'addon-installed', asset().name, asset().tag, PLATFORM_ARCH);

const installRemotely = async (): Promise<void> => {
  stubGithub();
  setMode('remote');
  expect(await run()).toBe('installed');
};

const startFreshLocalWorktree = (): void => {
  rmSync(join(work, 'cache', 'addon-prebuilt'), { recursive: true, force: true });
  packageDir = newPackage('worktree-two');
  logs = [];
  setMode('local');
};

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), 'brock-installed-'));
  made.push(work);
  mkdirSync(join(work, 'coord'));
  packageDir = newPackage('pkg');
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

describe('the cached installed addon', () => {
  it('stores the extracted files after a download', async () => {
    await installRemotely();
    expect(readFileSync(join(entryDir(), 'files', 'sdl3_input.node'), 'utf8')).toBe('addon bytes');
    const manifest = JSON.parse(readFileSync(join(entryDir(), 'manifest.json'), 'utf8')) as { files: Record<string, string>; source: string };
    expect(manifest.files['sdl3_input.node']).toBe(createHash('sha256').update('addon bytes').digest('hex'));
    expect(manifest.source).toBe('prebuilt');
  });

  it('restores a fresh local worktree with no fetch when the archive is not cached', async () => {
    await installRemotely();
    startFreshLocalWorktree();
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    expect(await run()).toBe('installed');
    expect(readFileSync(installedFile(), 'utf8')).toBe('addon bytes');
    expect(logs.some((line) => line.includes('Restored the installed'))).toBe(true);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('reads a file with a bad sha256 as a miss', async () => {
    await installRemotely();
    writeFileSync(join(entryDir(), 'files', 'sdl3_input.node'), 'tampered');
    startFreshLocalWorktree();
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    expect(await run()).toBe('unavailable');
    expect(existsSync(installedFile())).toBe(false);
    expect(fetchStub).not.toHaveBeenCalled();
  });

  it('stores an addon already on disk when its marker matches the pins', async () => {
    await installRemotely();
    rmSync(join(work, 'cache'), { recursive: true, force: true });
    expect(existsSync(entryDir())).toBe(false);
    expect(await run()).toBe('current');
    expect(readFileSync(join(entryDir(), 'files', 'sdl3_input.node'), 'utf8')).toBe('addon bytes');
  });

  it('never stores an addon whose marker does not match the pins', async () => {
    await installRemotely();
    rmSync(join(work, 'cache'), { recursive: true, force: true });
    writeFileSync(join(packageDir, 'native', 'package.json'), JSON.stringify({ version: '9.9.9', sdl3: '2.0.0', libusb: '1.0.0' }));
    setMode('local');
    expect(await run()).toBe('kept');
    expect(existsSync(join(work, 'cache', 'addon-installed'))).toBe(false);
  });
});
