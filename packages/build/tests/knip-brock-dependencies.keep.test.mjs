/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import keepBrockRuntimeDependencies from '../src/knip-brock-dependencies.mjs';

const BROCK_BIN = resolve(import.meta.dirname, '..', 'bin', 'brock.mjs');
const REPO_KNIP = resolve(dirname(createRequire(resolve(import.meta.dirname, '..', '..', '..', 'package.json')).resolve('knip')), '..');
const made = [];

const textOf = (content) => (typeof content === 'string' ? content : `${JSON.stringify(content)}\n`);

const write = (root, files) => {
  Object.entries(files).forEach(([file, content]) => {
    const path = join(root, ...file.split('/'));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, textOf(content));
  });
  return root;
};

const library = (name, extra = {}) => ({
  [`node_modules/${name}/package.json`]: { name, version: '1.0.0', type: 'module', main: 'index.js', ...extra },
  [`node_modules/${name}/index.js`]: 'export const value = 1;\n',
});

const app = () => write(mkdtempSync(join(tmpdir(), 'brock-knip-')), {
  'package.json': {
    name: 'knip-app',
    type: 'module',
    main: 'dist/electron/main.js',
    dependencies: {
      '@drizztdourden08/brock-electron': '^0.17.0',
      '@drizztdourden08/brock-react': '^0.17.0',
      '@electron-toolkit/utils': '^4.0.0',
      zustand: '^5.0.0',
      'left-pad': '^1.3.0',
    },
  },
  'brock.config.ts': 'export default {};\n',
  'knip.json': { entry: ['electron/main.ts'], project: ['electron/**/*.ts'] },
  'electron/main.ts': "import { value } from '@drizztdourden08/brock-electron';\nimport { value as other } from '@drizztdourden08/brock-react';\n\nexport const total = value + other;\n",
  ...library('@drizztdourden08/brock-electron', { dependencies: { '@electron-toolkit/utils': '^4.0.0' } }),
  ...library('@drizztdourden08/brock-react', { peerDependencies: { zustand: '^5.0.0' } }),
  ...library('@electron-toolkit/utils'),
  ...library('zustand'),
  ...library('left-pad'),
});

const withRepoKnip = (root) => {
  symlinkSync(REPO_KNIP, join(root, 'node_modules', 'knip'), 'junction');
  return root;
};

const unusedIn = (root) => {
  const run = spawnSync(process.execPath, [BROCK_BIN, 'knip', '--reporter', 'json', '--include', 'dependencies'], { cwd: root, encoding: 'utf8' });
  const report = JSON.parse(run.stdout.slice(run.stdout.indexOf('{')));
  return report.issues.flatMap((issue) => issue.dependencies.map((dep) => dep.name));
};

const issue = (workspace, symbol) => ({ type: 'dependencies', workspace, symbol });

const unlinkKnip = (dir) => {
  const link = join(dir, 'node_modules', 'knip');
  const isLink = (() => {
    try {
      return lstatSync(link).isSymbolicLink();
    } catch {
      return false;
    }
  })();
  if (isLink) unlinkSync(link);
};

afterEach(() => {
  for (const dir of made.splice(0)) {
    unlinkKnip(dir);
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('brock knip and the packages Brock bundles', () => {
  it('drops an unused dependency an app declares for its bundled Brock packages, and keeps the rest', () => {
    const root = app();
    made.push(root);
    const data = {
      cwd: root,
      issues: { dependencies: { 'package.json': { zustand: issue('.', 'zustand'), '@electron-toolkit/utils': issue('.', '@electron-toolkit/utils'), 'left-pad': issue('.', 'left-pad') } } },
      counters: { dependencies: 3 },
    };
    const kept = keepBrockRuntimeDependencies(data);
    expect(Object.keys(kept.issues.dependencies['package.json'])).toEqual(['left-pad']);
    expect(kept.counters.dependencies).toBe(1);
  });

  it('counts vite-plugin-node-polyfills as used while build.nodePolyfills is on', () => {
    const root = app();
    made.push(root);
    const polyfills = { cwd: root, issues: { dependencies: { 'package.json': { 'vite-plugin-node-polyfills': issue('.', 'vite-plugin-node-polyfills') } } }, counters: { dependencies: 1 } };
    expect(keepBrockRuntimeDependencies(polyfills).counters.dependencies).toBe(1);
    write(root, { 'brock.config.ts': 'export default { build: { nodePolyfills: { globals: { Buffer: true } } } };\n' });
    expect(keepBrockRuntimeDependencies(polyfills).counters.dependencies).toBe(0);
    write(root, { 'brock.config.ts': 'export default { build: { nodePolyfills: false } };\n' });
    expect(keepBrockRuntimeDependencies(polyfills).counters.dependencies).toBe(1);
  });

  it('counts clang-format-node as used while gate.clangFormat names sources', () => {
    const root = app();
    made.push(root);
    const pinned = { cwd: root, issues: { dependencies: { 'package.json': { 'clang-format-node': issue('.', 'clang-format-node') } } }, counters: { dependencies: 1 } };
    write(root, { 'brock.config.ts': 'export default { gate: { clangFormat: [] } };\n' });
    expect(keepBrockRuntimeDependencies(pinned).counters.dependencies).toBe(1);
    write(root, { 'brock.config.ts': "export default { gate: { clangFormat: ['core/game-hooks'] } };\n" });
    expect(keepBrockRuntimeDependencies(pinned).counters.dependencies).toBe(0);
  });

  it('leaves a workspace without brock.config.ts alone', () => {
    const root = app();
    made.push(root);
    write(root, { 'packages/model/package.json': { name: 'model', dependencies: { zustand: '^5.0.0' } } });
    const data = { cwd: root, issues: { dependencies: { 'packages/model/package.json': { zustand: issue('packages/model', 'zustand') } } }, counters: { dependencies: 1 } };
    expect(keepBrockRuntimeDependencies(data).counters.dependencies).toBe(1);
  });

  it('gives the same answer on a fresh checkout as after a build wrote dist', () => {
    const root = app();
    made.push(root);
    expect(unusedIn(root)).toEqual(['left-pad']);
    withRepoKnip(root);
    expect(unusedIn(root)).toEqual(['left-pad']);
    write(root, { 'dist/electron/main.js': "import '@electron-toolkit/utils';\nimport 'zustand';\n" });
    expect(unusedIn(root)).toEqual(['left-pad']);
  }, 60000);
});
