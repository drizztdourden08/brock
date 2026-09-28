/* @layer core @kind test */
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WASM_DEFAULTS, staleReasonOf, wasmStaleReason } from '../ensure-wasm/index.mjs';

const MISSING = 'the core output is missing';
const CHANGED = 'sources changed since the last build';

describe('staleReasonOf', () => {
  it('asks for a build when there is no output', () => {
    expect(staleReasonOf({ outputTimes: [], sourceTimes: [5] })).toBe(MISSING);
  });

  it('asks for a build when a source is newer than the oldest output', () => {
    expect(staleReasonOf({ outputTimes: [100, 50], sourceTimes: [60] })).toBe(CHANGED);
  });

  it('is current when every source is older than every output', () => {
    expect(staleReasonOf({ outputTimes: [100, 90], sourceTimes: [10, 80] })).toBeNull();
  });
});

describe('wasmStaleReason', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  const touch = (file: string, seconds: number): void => {
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, '');
    utimesSync(file, seconds, seconds);
  };

  const project = (): string => {
    const root = mkdtempSync(join(tmpdir(), 'port-kit-wasm-'));
    dirs.push(root);
    touch(join(root, 'core/src/game.c'), 1000);
    touch(join(root, 'core/third_party/lib.c'), 9000);
    touch(join(root, 'core/wasm-build/build.mjs'), 1000);
    return root;
  };

  it('reports a missing core', () => {
    expect(wasmStaleReason(project(), WASM_DEFAULTS)).toBe(MISSING);
  });

  it('is current after a build and skips vendored folders', () => {
    const root = project();
    touch(join(root, 'public/wasm/game.wasm'), 2000);
    touch(join(root, 'public/wasm/game.js'), 2000);
    expect(wasmStaleReason(root, WASM_DEFAULTS)).toBeNull();
  });

  it('asks for a build after a C source changes', () => {
    const root = project();
    touch(join(root, 'public/wasm/game.wasm'), 2000);
    touch(join(root, 'core/src/game.h'), 3000);
    expect(wasmStaleReason(root, WASM_DEFAULTS)).toBe(CHANGED);
  });
});
