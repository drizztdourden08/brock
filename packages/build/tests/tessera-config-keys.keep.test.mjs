/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { configKeyMoves } from '../src/upgrade/tessera/config-key-moves.mjs';
import { tesseraRenamesStep } from '../src/upgrade/tessera/tessera-renames-step.mjs';

const CONFIG_MAP = {
  'apps.*.old.usage': 'apps.*.fresh.usage',
  'apps.*.old.tree': 'apps.*.fresh.tree',
  'old.usage': 'fresh.usage',
  'old.tree': 'fresh.tree',
  'old.out': 'fresh.out',
};

const SCRIPT_MAP = { 'scripts.old': 'scripts.fresh' };

const CONTEXT = { file: 'tessera.config.json', version: '0.10.0' };

const move = (source, map = CONFIG_MAP) => configKeyMoves(source, map, CONTEXT);

const made = [];

const jsonText = (value) => `${JSON.stringify(value, null, 2)}\n`;

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-config-keys-'));
  made.push(root);
  Object.entries(files).forEach(([file, value]) => {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, typeof value === 'string' ? value : jsonText(value));
  });
  return root;
};

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('configKeyMoves', () => {
  it('renames an object in place when every key in it moves alike, keeping a one-line layout', () => {
    const source = '{\n  "$schema": "x",\n  "old": { "usage": "enforce", "tree": "a.ts" },\n  "stories": "s"\n}\n';
    expect(move(source)).toEqual({ source: '{\n  "$schema": "x",\n  "fresh": { "usage": "enforce", "tree": "a.ts" },\n  "stories": "s"\n}\n', todos: [] });
  });

  it('moves the same keys under every app, where * is one app folder', () => {
    const source = '{\n    "apps": {\n        "apps/desktop": {\n            "old": {\n                "usage": "warn"\n            }\n        },\n        "apps/web": { "parts": {} }\n    }\n}\n';
    expect(move(source).source).toBe(source.replace('"old"', '"fresh"'));
  });

  it('renames a package.json script where it stands', () => {
    const source = '{\n\t"scripts": {\n\t\t"dev": "vite",\n\t\t"old": "tessera old",\n\t\t"build": "vite build"\n\t}\n}\n';
    expect(configKeyMoves(source, SCRIPT_MAP, { file: 'package.json', version: '0.10.0' }).source).toBe(source.replace('"old":', '"fresh":'));
  });

  it('moves the listed keys into a new object and leaves a key the release does not list', () => {
    const source = '{\n  "old": {\n    "usage": "enforce",\n    "extra": true\n  }\n}\n';
    expect(move(source).source).toBe('{\n  "old": {\n    "extra": true\n  },\n  "fresh": {\n    "usage": "enforce"\n  }\n}\n');
  });

  it('carries a nested value at the indentation of its new place, and drops the emptied object', () => {
    const map = { 'old.usage': 'deep.inner.usage' };
    const source = '{\n  "old": {\n    "usage": {\n      "mode": "warn"\n    }\n  }\n}\n';
    expect(move(source, map).source).toBe('{\n  "deep": {\n    "inner": {\n      "usage": {\n        "mode": "warn"\n      }\n    }\n  }\n}\n');
  });

  it('never overwrites a key that is already there, and leaves a to-do', () => {
    const source = '{\n  "old": { "usage": "warn" },\n  "fresh": { "usage": "enforce" }\n}\n';
    const result = move(source);
    expect(result.source).toBe(source);
    expect(result.todos).toEqual([{ line: 2, message: expect.stringContaining('moves the tessera.config.json setting old.usage to fresh.usage') }]);
  });

  it('changes nothing on a second run, nor in a file that is not JSON', () => {
    const once = move('{ "old": { "usage": "warn", "out": "docs" } }\n').source;
    expect(once).toBe('{ "fresh": { "usage": "warn", "out": "docs" } }\n');
    expect(move(once)).toEqual({ source: once, todos: [] });
    expect(move('{ not json')).toEqual({ source: '{ not json', todos: [] });
  });

  it('replays the configKeys of the installed Tessera', () => {
    const tesseraDir = dirname(createRequire(import.meta.url).resolve('@drizztdourden08/tessera/package.json'));
    const renames = JSON.parse(readFileSync(join(tesseraDir, 'RENAMES.json'), 'utf8'));
    const { configKeys } = renames.releases.find((release) => release.configKeys);
    const map = configKeys['tessera.config.json'];
    const [from, to] = Object.entries(map).find(([key]) => !key.startsWith('apps.'));
    const [oldKey, leaf] = from.split('.');
    const source = `{\n  ${JSON.stringify(oldKey)}: { ${JSON.stringify(leaf)}: "enforce" }\n}\n`;
    const result = configKeyMoves(source, map, CONTEXT);
    expect(JSON.parse(result.source)).toEqual({ [to.split('.')[0]]: { [leaf]: 'enforce' } });
  });
});

describe('the Tessera renames step: configKeys', () => {
  const RELEASES = [{ version: '0.10.0', configKeys: { 'tessera.config.json': CONFIG_MAP, 'package.json': SCRIPT_MAP } }];

  it('moves the keys at the repo root and in every workspace package', () => {
    const root = repo({
      'pnpm-workspace.yaml': 'packages:\n  - apps/*\n  - packages/*\n',
      'package.json': { name: 'repo', scripts: { old: 'tessera old' } },
      'tessera.config.json': { old: { usage: 'enforce' }, apps: { 'apps/desktop': { old: { tree: 'tree.ts' } } } },
      'apps/desktop/brock.config.ts': 'export default {};\n',
      'apps/desktop/package.json': { name: 'desktop', scripts: { dev: 'brock dev' } },
      'apps/desktop/node_modules/@drizztdourden08/tessera/package.json': { name: '@drizztdourden08/tessera', version: '0.10.0' },
      'apps/desktop/node_modules/@drizztdourden08/tessera/RENAMES.json': { releases: RELEASES },
      'packages/design/package.json': { name: 'design', scripts: { old: 'tessera old' } },
    });
    const run = tesseraRenamesStep({ rootDir: join(root, 'apps/desktop'), from: '0.9.1' });
    expect(run.applied[0].touched).toEqual(['../../tessera.config.json', '../../package.json', '../../packages/design/package.json']);
    expect(JSON.parse(readFileSync(join(root, 'tessera.config.json'), 'utf8'))).toEqual({ fresh: { usage: 'enforce' }, apps: { 'apps/desktop': { fresh: { tree: 'tree.ts' } } } });
    expect(JSON.parse(readFileSync(join(root, 'packages/design/package.json'), 'utf8')).scripts).toEqual({ fresh: 'tessera old' });
    expect(tesseraRenamesStep({ rootDir: join(root, 'apps/desktop'), from: '0.9.1' }).applied[0].touched).toEqual([]);
  });
});
