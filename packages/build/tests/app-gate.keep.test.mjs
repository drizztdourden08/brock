/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { cSources } from '../src/gate/c-sources.mjs';
import { clangFormatFiles } from '../src/gate/clang-format-files.mjs';
import { findClangFormat } from '../src/gate/find-clang-format.mjs';
import { gateSteps } from '../src/gate/gate-steps.mjs';
import { runClangFormat } from '../src/gate/run-clang-format.mjs';
import { runGate } from '../src/gate/run-gate.mjs';

const { tempDir, put, cleanup } = tempTree('brock-gate-');

afterEach(cleanup);

const pin = (dir, real) => {
  put(dir, 'node_modules/clang-format-node/package.json', JSON.stringify({ name: 'clang-format-node', bin: { 'clang-format': 'cli.mjs' } }));
  put(dir, 'node_modules/clang-format-node/cli.mjs', `import { spawnSync } from 'node:child_process';\nprocess.exitCode = spawnSync(${JSON.stringify(real)}, process.argv.slice(2), { windowsHide: true, stdio: 'inherit' }).status ?? 1;\n`);
};

const workspace = () => {
  const root = tempDir();
  put(root, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n');
  put(root, 'package.json', JSON.stringify({ scripts: { 'schema:check': 'node check.mjs', 'codegen:check': 'node root.mjs' } }));
  put(root, 'apps/desktop/package.json', JSON.stringify({ scripts: { 'codegen:check': 'node app.mjs' } }));
  return { root, app: join(root, 'apps', 'desktop') };
};

describe('K1 gate steps from brock.config.ts', { tags: ['critical'] }, () => {
  it('runs the C check first, then each script from the app package, else the workspace root', () => {
    const { root, app } = workspace();
    const steps = gateSteps(app, { gate: { scripts: ['codegen:check', 'schema:check'], clangFormat: ['native/src'] } });
    expect(steps).toEqual([
      { kind: 'clang-format', name: 'clang-format --dry-run (native/src)', entries: ['native/src'] },
      { kind: 'script', name: 'pnpm run codegen:check', dir: app, script: 'codegen:check' },
      { kind: 'script', name: 'pnpm run schema:check (in ../..)', dir: root, script: 'schema:check' },
    ]);
    expect(gateSteps(app, {})).toEqual([]);
  });

  it('refuses a script neither package declares', () => {
    const { app } = workspace();
    expect(() => gateSteps(app, { gate: { scripts: ['gba:index:check'] } })).toThrow(/no package.json script "gba:index:check"/);
  });

  it('runs every step and returns the ones that failed', async () => {
    const { app } = workspace();
    const ran = [];
    const lines = [];
    const run = async (_dir, step) => {
      ran.push(step.name);
      return step.script === 'codegen:check' ? 2 : 0;
    };
    const failed = await runGate({ appDir: app, label: 'apps/desktop', config: { gate: { scripts: ['codegen:check', 'schema:check'] } }, log: (line) => lines.push(line), run });
    expect(ran).toEqual(['pnpm run codegen:check', 'pnpm run schema:check (in ../..)']);
    expect(failed).toEqual(['pnpm run codegen:check']);
    expect(await runGate({ appDir: app, label: '.', config: {}, log: (line) => lines.push(line), run })).toEqual([]);
    expect(lines.at(-1)).toMatch(/declares no gate steps/);
  });
});

describe('K4 the managed .clang-format', { tags: ['critical'] }, () => {
  it('is written at the repo root while gate.clangFormat names sources', () => {
    const { root, app } = workspace();
    expect(clangFormatFiles(app, {})).toEqual([]);
    const [file] = clangFormatFiles(app, { gate: { clangFormat: ['native/src'] } });
    expect(file.path).toBe('../../.clang-format');
    expect(clangFormatFiles(root, { gate: { clangFormat: ['core'] } })[0].path).toBe('.clang-format');
  });

  it('checks every .c and .h file under the named folders, outside dot-folders', () => {
    const root = tempDir();
    put(root, 'core/hooks/a.c');
    put(root, 'core/hooks/a.h');
    put(root, 'core/hooks/notes.md');
    put(root, 'core/hooks/deep/b.c');
    put(root, 'core/hooks/.cache/c.c');
    put(root, 'core/one.c');
    expect(cSources(root, ['core/hooks', 'core/one.c', 'core/hooks/a.c']).map((file) => file.slice(root.length + 1).replace(/\\/g, '/')))
      .toEqual(['core/hooks/a.c', 'core/hooks/a.h', 'core/hooks/deep/b.c', 'core/one.c']);
    expect(() => cSources(root, ['../elsewhere'])).toThrow(/outside the repo/);
    expect(() => cSources(root, ['core/missing'])).toThrow(/does not exist/);
  });

  it('runs BROCK_CLANG_FORMAT, else the clang-format-node the app or the repo pins, and nothing unpinned', () => {
    const { root, app } = workspace();
    expect(findClangFormat([app, root], { BROCK_CLANG_FORMAT: '/opt/llvm/bin/clang-format' })).toEqual(['/opt/llvm/bin/clang-format']);
    expect(findClangFormat([app, root], {})).toBeNull();
    pin(root, 'clang-format');
    expect(findClangFormat([app, root], {})).toEqual([process.execPath, join(root, 'node_modules', 'clang-format-node', 'cli.mjs')]);
  });

  it('says to run brock sync when .clang-format is missing', () => {
    const { app } = workspace();
    expect(() => runClangFormat({ appDir: app, entries: ['core'], check: true })).toThrow(/run brock sync/);
  });
});
