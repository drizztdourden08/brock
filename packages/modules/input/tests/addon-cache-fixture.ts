/* @layer tooling-scripts @kind test */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { vi } from 'vitest';
import { ensureAddon, prebuiltAssetOf, readPins } from '../ensure-addon/index.mjs';

const PLATFORM_ARCH = `${process.platform}-${process.arch}`;
const PINS = JSON.stringify({ version: '9.9.9', sdl3: '1.0.0', libusb: '1.0.0' });

const addonCacheFixture = () => {
  const made: string[] = [];
  const state = { work: '', packageDir: '', archive: '', logs: [] as string[] };

  const newPackage = (name: string): string => {
    const dir = join(state.work, name);
    mkdirSync(join(dir, 'native'), { recursive: true });
    writeFileSync(join(dir, 'native', 'package.json'), PINS);
    return dir;
  };

  const makeArchive = (): string => {
    mkdirSync(join(state.work, 'source'), { recursive: true });
    writeFileSync(join(state.work, 'source', 'sdl3_input.node'), 'addon bytes');
    execFileSync('tar', ['-czf', 'prebuilt.tar.gz', '-C', 'source', '.'], { windowsHide: true, cwd: state.work });
    return join(state.work, 'prebuilt.tar.gz');
  };

  const setup = (): void => {
    state.work = mkdtempSync(join(tmpdir(), 'brock-addon-cache-'));
    made.push(state.work);
    mkdirSync(join(state.work, 'coord'));
    state.packageDir = newPackage('pkg');
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', join(state.work, 'cache'));
    vi.stubEnv('COORD_HOME', join(state.work, 'coord'));
    vi.stubEnv('GITHUB_ACTIONS', '');
    vi.stubEnv('CI', '');
    state.archive = makeArchive();
    state.logs = [];
  };

  const teardown = (): void => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
  };

  const setMode = (mode: string): void => writeFileSync(join(state.work, 'coord', 'remote.json'), JSON.stringify({ mode }));
  const run = () => ensureAddon({ packageDir: state.packageDir, mode: 'postinstall', env: process.env, log: (line) => state.logs.push(line) });

  const stubGithub = () => {
    const digest = createHash('sha256').update(readFileSync(state.archive)).digest('hex');
    const fetchStub = vi.fn((url: string, init?: { method?: string }) => {
      if (init?.method === 'HEAD') return Promise.resolve(new Response(null, { status: 200 }));
      if (url.endsWith('.sha256')) return Promise.resolve(new Response(`${digest}  prebuilt.tar.gz`));
      return Promise.resolve(new Response(readFileSync(state.archive)));
    });
    vi.stubGlobal('fetch', fetchStub);
    return fetchStub;
  };

  const blockNetwork = () => {
    const fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    return fetchStub;
  };

  const asset = () => prebuiltAssetOf(readPins(join(state.packageDir, 'native')), PLATFORM_ARCH);
  const installedFile = () => join(state.packageDir, 'native', 'prebuilds', PLATFORM_ARCH, 'sdl3_input.node');

  return { state, newPackage, setup, teardown, setMode, run, stubGithub, blockNetwork, asset, installedFile };
};

export { PLATFORM_ARCH, addonCacheFixture };
