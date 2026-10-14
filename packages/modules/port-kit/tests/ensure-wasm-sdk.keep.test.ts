/* @layer core @kind test */
import { existsSync, mkdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WASM_DEFAULTS, emsdkOf, ensureWasm, mainCheckoutOf } from '../ensure-wasm/index.mjs';
import { scratchDirs } from './fakes/scratch-dirs';

const BUILD_SCRIPT = `
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('public/wasm', { recursive: true });
writeFileSync('public/wasm/game.wasm', '');
writeFileSync('public/wasm/game.js', '');
writeFileSync('activated.txt', process.env.PORT_KIT_TEST_ACTIVATED ?? 'no');
`;

const scratch = scratchDirs('port-kit-sdk-');
const scratchDir = scratch.make;
const log = (): void => undefined;

afterEach(scratch.clean);

const project = (): string => {
  const root = scratchDir();
  mkdirSync(join(root, 'core/wasm-build'), { recursive: true });
  writeFileSync(join(root, 'core/wasm-build/build.mjs'), BUILD_SCRIPT);
  utimesSync(join(root, 'core/wasm-build/build.mjs'), 1000, 1000);
  return root;
};

const withEnv = <T>(change: Record<string, string | undefined>, run: () => T): T => {
  const saved = Object.fromEntries(Object.keys(change).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(change)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return run();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

describe('emsdkOf', () => {
  it('finds the activation script on Windows only', () => {
    const sdk = scratchDir();
    writeFileSync(join(sdk, 'emsdk_env.bat'), '');
    expect(emsdkOf('/', { ...WASM_DEFAULTS, emsdkDir: sdk }, { env: { PATH: '' }, platform: 'win32' })).toMatchObject({ dir: sdk, activate: join(sdk, 'emsdk_env.bat'), found: true });
    expect(emsdkOf('/', { ...WASM_DEFAULTS, emsdkDir: sdk }, { env: { PATH: '' }, platform: 'linux' })).toMatchObject({ activate: null, found: false });
  });

  it('counts emcc on the path as an SDK', () => {
    const bin = scratchDir();
    writeFileSync(join(bin, 'emcc'), '');
    expect(emsdkOf('/', { ...WASM_DEFAULTS, emsdkDir: scratchDir() }, { env: { PATH: bin }, platform: 'linux' }).found).toBe(true);
  });
});

const GIT = '.git';

const checkoutWithWorktree = (): { main: string; worktree: string } => {
  const main = scratchDir();
  mkdirSync(join(main, GIT, 'worktrees', 'feature'), { recursive: true });
  writeFileSync(join(main, GIT, 'worktrees', 'feature', 'commondir'), '../..\n');
  mkdirSync(join(main, 'third_party/emsdk/upstream/emscripten'), { recursive: true });
  const worktree = join(main, '.worktrees', 'feature');
  mkdirSync(join(worktree, 'apps/game'), { recursive: true });
  writeFileSync(join(worktree, GIT), `gitdir: ${join(main, GIT, 'worktrees', 'feature')}\n`);
  mkdirSync(join(main, 'apps/game/third_party/emsdk/upstream/emscripten'), { recursive: true });
  return { main, worktree };
};

describe('emsdkOf inside a git worktree', () => {
  it('names the main checkout of a linked worktree, and none for the main checkout itself', () => {
    const { main, worktree } = checkoutWithWorktree();
    expect(mainCheckoutOf(join(worktree, 'apps/game'))).toEqual({ top: worktree, main });
    expect(mainCheckoutOf(main)).toBeNull();
  });

  it('takes the SDK folder of the main checkout when the worktree has none', () => {
    const { main, worktree } = checkoutWithWorktree();
    const host = { env: { PATH: '' }, platform: 'linux' as const };
    expect(emsdkOf(worktree, WASM_DEFAULTS, host)).toMatchObject({ dir: join(main, 'third_party/emsdk'), mainCheckout: true, found: true });
    expect(emsdkOf(join(worktree, 'apps/game'), WASM_DEFAULTS, host)).toMatchObject({ dir: join(main, 'apps/game/third_party/emsdk'), mainCheckout: true });
  });

  it('keeps the worktree SDK, $EMSDK and an absolute folder first', () => {
    const { worktree } = checkoutWithWorktree();
    mkdirSync(join(worktree, 'third_party/emsdk/upstream/emscripten'), { recursive: true });
    const host = { env: { PATH: '' }, platform: 'linux' as const };
    expect(emsdkOf(worktree, WASM_DEFAULTS, host)).toMatchObject({ dir: join(worktree, 'third_party/emsdk'), mainCheckout: false });
    const elsewhere = scratchDir();
    expect(emsdkOf(join(worktree, 'apps/game'), WASM_DEFAULTS, { ...host, env: { PATH: '', EMSDK: elsewhere } })).toMatchObject({ dir: elsewhere, mainCheckout: false, found: false });
    expect(emsdkOf(join(worktree, 'apps/game'), { ...WASM_DEFAULTS, emsdkDir: elsewhere }, host)).toMatchObject({ dir: elsewhere, mainCheckout: false, found: false });
  });
});

describe('ensureWasm without an SDK', () => {
  it('skips a stale core when asked to, and builds otherwise', () => {
    const root = project();
    const wasm = { ...WASM_DEFAULTS, emsdkDir: scratchDir() };
    const skipped = withEnv({ EMSDK: undefined, PATH: '' }, () => ensureWasm({ root, wasm: { ...wasm, skipWithoutSdk: true }, log }));
    expect(skipped).toBe('skipped');
    expect(existsSync(join(root, 'public/wasm/game.wasm'))).toBe(false);
    expect(withEnv({ EMSDK: undefined }, () => ensureWasm({ root, wasm, log }))).toBe('built');
  });
});

describe.runIf(process.platform === 'win32')('ensureWasm on Windows', () => {
  it('activates the SDK through emsdk_env.bat before the build script', () => {
    const root = project();
    const sdk = scratchDir();
    writeFileSync(join(sdk, 'emsdk_env.bat'), '@echo off\r\nset PORT_KIT_TEST_ACTIVATED=yes\r\n');
    withEnv({ EMSDK: sdk }, () => ensureWasm({ root, wasm: WASM_DEFAULTS, log }));
    expect(readFileSync(join(root, 'activated.txt'), 'utf8')).toBe('yes');
  });
});
