/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { cSources } from '../src/gate/c-sources.mjs';
import { clangFormatFiles } from '../src/gate/clang-format-files.mjs';
import { findClangFormat, systemClangFormat } from '../src/gate/find-clang-format.mjs';
import { gateSteps } from '../src/gate/gate-steps.mjs';
import { runClangFormat } from '../src/gate/run-clang-format.mjs';
import { runGate } from '../src/gate/run-gate.mjs';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';

const { tempDir, put, cleanup } = tempTree('brock-gate-');

afterEach(cleanup);

const pin = (dir, real) => {
  put(dir, 'node_modules/clang-format-node/package.json', JSON.stringify({ name: 'clang-format-node', bin: { 'clang-format': 'cli.mjs' } }));
  put(dir, 'node_modules/clang-format-node/cli.mjs', `import { spawnSync } from 'node:child_process';\nprocess.exitCode = spawnSync(${JSON.stringify(real)}, process.argv.slice(2), { stdio: 'inherit' }).status ?? 1;\n`);
};

const workspace = () => {
  const root = tempDir();
  put(root, 'pnpm-workspace.yaml', 'packages:\n  - apps/*\n');
  put(root, 'package.json', JSON.stringify({ scripts: { 'schema:check': 'node check.mjs', 'codegen:check': 'node root.mjs' } }));
  put(root, 'apps/desktop/package.json', JSON.stringify({ scripts: { 'codegen:check': 'node app.mjs' } }));
  return { root, app: join(root, 'apps', 'desktop') };
};

describe('gate steps from brock.config.ts', () => {
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

  it('is a step of the quality job, in a standalone app and in each app of a workspace', () => {
    const step = '      - name: App gate steps\n        run: pnpm --dir "$APP_DIR" exec brock gate\n';
    const standalone = composeWorkflows({ targets: ['windows'], prefix: '' }).ci;
    const ofApp = composeWorkflows({ targets: ['windows'], prefix: '', appDir: 'apps/desktop', app: { name: 'desktop', tagPrefix: 'desktop-v', notesDir: 'apps/desktop/release-notes' } }).ci;
    for (const ci of [standalone, ofApp]) {
      const quality = ci.slice(ci.indexOf('  quality:'), ci.indexOf('  review:'));
      expect(quality).toContain(step);
      expect(quality.indexOf('name: Release note')).toBeLessThan(quality.indexOf('name: App gate steps'));
      expect(quality).not.toMatch(/\n\n\n/);
    }
  });
});

describe('the managed .clang-format', () => {
  it('is written at the repo root while gate.clangFormat names sources', () => {
    const { root, app } = workspace();
    expect(clangFormatFiles(app, {})).toEqual([]);
    const [file] = clangFormatFiles(app, { gate: { clangFormat: ['native/src'] } });
    expect(file.path).toBe('../../.clang-format');
    expect(file.content).toContain('ColumnLimit: 0\n');
    expect(file.content).toContain('PointerAlignment: Right\n');
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

  it('names the package to pin when there is none', () => {
    const { root, app } = workspace();
    put(root, '.clang-format', 'BasedOnStyle: Google\n');
    put(root, 'core/a.c', 'int a;\n');
    expect(() => runClangFormat({ appDir: app, entries: ['core'], check: true, find: () => null })).toThrow(/pnpm add -D -E clang-format-node/);
  });
});

const HOUSE_STYLE = [
  '/* @layer native-sample @kind native */',
  '#include "sample_internal.h"',
  '',
  'static uint8 g_last_item_id = 0;',
  '',
  'static bool IsSpecialId(uint8 item) {',
  '  return item == 0x10 || item == 0x0f || item == 0x26;',
  '}',
  '',
  'int SampleFrameWidth(void) { return g_frame_width; }',
  '',
  'bool Sample_TitleScreenFixes(void) {',
  '  return current_mode == MODE_TITLE',
  '      && (option_flags & kOption_WideView) != 0;',
  '}',
  '',
  'bool Sample_SwapPanels(int *left, int *right) {',
  '  if (!(option_flags & kOption_Swap)) return false;',
  '  switch (kind) {',
  '    case kPanel_Left: word = &left_panel; break;',
  '    default:',
  '      break;',
  '  }',
  '  printf("[Sample] keeping 0x%02x\\n",',
  '         g_last_item_id);',
  '  return true;',
  '}',
  '',
  '#endif  // SAMPLE_VIEW_H',
  '',
].join('\n');

const bin = systemClangFormat();

describe.skipIf(!bin)('clang-format with the managed style', () => {
  it('leaves code written in the house style as it is', () => {
    const { root, app } = workspace();
    put(root, '.clang-format', clangFormatFiles(app, { gate: { clangFormat: ['core'] } })[0].content);
    pin(app, bin);
    put(root, 'core/hooks/style.c', HOUSE_STYLE);
    expect(runClangFormat({ appDir: app, entries: ['core'], check: true, log: () => undefined })).toBe(0);
  });

  it('lists the files that differ, rewrites them, then passes', () => {
    const { root, app } = workspace();
    put(root, '.clang-format', clangFormatFiles(app, { gate: { clangFormat: ['core'] } })[0].content);
    pin(app, bin);
    put(root, 'core/good.c', 'int Add(int a, int b) { return a + b; }\n');
    put(root, 'core/bad.c', 'int  Sub( int a,int b ){\n        return a-b;\n}\n');
    const lines = [];
    expect(runClangFormat({ appDir: app, entries: ['core'], check: true, log: (line) => lines.push(line) })).toBe(1);
    expect(lines.join('\n')).toMatch(/core\/bad\.c: \d+ place\(s\) differ/);
    expect(lines.at(-1)).toBe('clang-format: 1 of 2 C file(s) match .clang-format; brock clang-format rewrites the others');
    expect(runClangFormat({ appDir: app, entries: ['core'], check: false, log: () => undefined })).toBe(0);
    expect(readFileSync(join(root, 'core/bad.c'), 'utf8')).toBe('int Sub(int a, int b) {\n  return a - b;\n}\n');
    expect(runClangFormat({ appDir: app, entries: ['core'], check: true, log: () => undefined })).toBe(0);
  });

  it('says to run brock sync when .clang-format is missing', () => {
    const { app } = workspace();
    expect(() => runClangFormat({ appDir: app, entries: ['core'], check: true })).toThrow(/run brock sync/);
  });
});
