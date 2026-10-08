/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { snes } from '../src/snes-verb.mjs';

const OUTPUT = 'apps/web/public/wasm';

const BUILD_SCRIPT = `
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('${OUTPUT}', { recursive: true });
writeFileSync('${OUTPUT}/game.wasm', '');
writeFileSync('${OUTPUT}/game.js', '');
writeFileSync('built-with.txt', process.env.EMSDK ?? '');
`;

describe('snes wasm, on the port kit stale check', () => {
  const dirs = [];
  let savedEmsdk;
  beforeEach(() => {
    savedEmsdk = process.env.EMSDK;
    delete process.env.EMSDK;
  });
  afterEach(() => {
    if (savedEmsdk !== undefined) process.env.EMSDK = savedEmsdk;
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  const scratchDir = () => {
    const dir = mkdtempSync(join(tmpdir(), 'snes-wasm-'));
    dirs.push(dir);
    return dir;
  };

  const touch = (file, seconds, body = '') => {
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, body);
    utimesSync(file, seconds, seconds);
  };

  const worktree = () => {
    const path = scratchDir();
    const main = scratchDir();
    touch(join(path, 'core/src/game.c'), 1000);
    touch(join(path, 'core/third_party/lib.c'), 9000);
    touch(join(path, 'core/wasm-build/build.mjs'), 1000, BUILD_SCRIPT);
    mkdirSync(join(main, 'third_party/emsdk/upstream/emscripten'), { recursive: true });
    return { path, main, log: () => undefined };
  };

  it('reports a missing core as stale and a built one as current', () => {
    const tree = worktree();
    const step = snes.wasmBuild();
    expect(step.isStale(tree)).toBe(true);
    touch(join(tree.path, OUTPUT, 'game.wasm'), 2000);
    touch(join(tree.path, OUTPUT, 'game.js'), 2000);
    expect(step.isStale(tree)).toBe(false);
    touch(join(tree.path, 'core/src/game.h'), 3000);
    expect(step.isStale(tree)).toBe(true);
  });

  it('builds with the SDK of the main checkout', () => {
    const tree = worktree();
    const step = snes.wasmBuild();
    step.run(tree);
    expect(step.isStale(tree)).toBe(false);
    expect(readFileSync(join(tree.path, 'built-with.txt'), 'utf8')).toBe(join(tree.main, 'third_party/emsdk'));
  });

  it('refuses to build without the SDK', () => {
    const tree = worktree();
    rmSync(join(tree.main, 'third_party'), { recursive: true, force: true });
    expect(() => snes.wasmBuild().run(tree)).toThrow(/Emscripten SDK not found/);
  });
});
