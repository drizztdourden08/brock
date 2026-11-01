/* @layer core @kind test */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WASM_DEFAULTS, emsdkOf, mainCheckoutOf } from '../ensure-wasm/index.mjs';
import { scratchDirs } from './fakes/scratch-dirs';

const scratch = scratchDirs('port-kit-sdk-');
const scratchDir = scratch.make;

afterEach(scratch.clean);

describe('K1 emsdkOf', { tags: ['critical'] }, () => {
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

describe('K1 emsdkOf inside a git worktree', { tags: ['critical'] }, () => {
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

