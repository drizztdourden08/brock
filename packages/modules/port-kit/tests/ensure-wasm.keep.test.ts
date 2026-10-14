/* @layer core @kind test */
import { mkdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WASM_DEFAULTS, ensureWasm } from '../ensure-wasm/index.mjs';
import { scratchDirs } from './fakes/scratch-dirs';

const BUILD_SCRIPT = `
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('public/wasm', { recursive: true });
writeFileSync('public/wasm/game.wasm', '');
writeFileSync('public/wasm/game.js', '');
writeFileSync('built-with.txt', process.env.EMSDK ?? '');
`;

describe('ensureWasm', () => {
  const scratch = scratchDirs('port-kit-ensure-');
  const scratchDir = scratch.make;
  const log = (): void => undefined;
  afterEach(scratch.clean);

  const project = (): string => {
    const root = scratchDir();
    mkdirSync(join(root, 'core/src'), { recursive: true });
    mkdirSync(join(root, 'core/wasm-build'), { recursive: true });
    writeFileSync(join(root, 'core/src/game.c'), '');
    writeFileSync(join(root, 'core/wasm-build/build.mjs'), BUILD_SCRIPT);
    utimesSync(join(root, 'core/src/game.c'), 1000, 1000);
    utimesSync(join(root, 'core/wasm-build/build.mjs'), 1000, 1000);
    return root;
  };

  it('builds a missing core and leaves a current one alone', () => {
    const root = project();
    expect(ensureWasm({ root, wasm: WASM_DEFAULTS, log })).toBe('built');
    expect(ensureWasm({ root, wasm: WASM_DEFAULTS, log })).toBe('current');
  });

  it('rebuilds a current core when forced', () => {
    const root = project();
    ensureWasm({ root, wasm: WASM_DEFAULTS, log });
    expect(ensureWasm({ root, wasm: WASM_DEFAULTS, log, force: true })).toBe('built');
  });

  it('takes an SDK folder outside the checkout', () => {
    const root = project();
    const sdk = scratchDir();
    mkdirSync(join(sdk, 'upstream/emscripten'), { recursive: true });
    const saved = process.env.EMSDK;
    delete process.env.EMSDK;
    try {
      ensureWasm({ root, wasm: { ...WASM_DEFAULTS, emsdkDir: sdk }, log });
    } finally {
      if (saved !== undefined) process.env.EMSDK = saved;
    }
    expect(readFileSync(join(root, 'built-with.txt'), 'utf8')).toBe(sdk);
  });
});
