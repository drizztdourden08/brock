/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { readCopyMap } from '../src/upgrade/tessera-copy/copy-map.mjs';
import { runMigrate } from '../src/commands/migrate.mjs';

const MAP_FILE = 'notes/copy-map.json';
const COPY = 'src/ds';
const VIEW = 'src/views/Panel.tsx';
const VIEW_SOURCE = "import { Box } from '../ds/primitives';\n\nexport const Panel = Box;\n";

const COPY_MAP = {
  entries: { primitives: 'primitives', composites: 'composites' },
  stylesheets: { 'tokens/index.css': 'tokens.css' },
  attributes: { Counter: { size: 'small' } },
  overlay: { '0.20.0': { components: { OldCounter: 'NumberInput' } } },
};

const made = [];

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

const put = (root) => ([file, value]) => {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
};

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-copy-map-'));
  made.push(root);
  Object.entries(files).forEach(put(root));
  return root;
};

const mapRepo = (map) => repo({ 'package.json': { name: 'sample-app' }, [MAP_FILE]: map });

const mapOf = (root) => join(root, MAP_FILE);

describe('the copy map of brock migrate --tessera-from-copy', () => {
  it('takes the folders, stylesheets, props and overlay from the file, from the Tessera baseline by default', () => {
    expect(readCopyMap(mapOf(mapRepo(COPY_MAP))).map).toEqual({ from: '0.3.0', ...COPY_MAP });
    expect(readCopyMap(mapOf(mapRepo({ from: '0.10.0', entries: { ui: 'primitives' } }))).map).toEqual({
      from: '0.10.0', entries: { ui: 'primitives' }, stylesheets: {}, attributes: {}, overlay: {},
    });
  });

  it('refuses a missing file, bad JSON and a map that names no Tessera entry', () => {
    const root = mapRepo({ entries: { ui: 'widgets' } });
    expect(readCopyMap(join(root, 'none.json')).refused).toMatch(/does not exist/);
    writeFileSync(join(root, 'bad.json'), '{ entries');
    expect(readCopyMap(join(root, 'bad.json')).refused).toMatch(/not valid JSON/);
    expect(readCopyMap(mapOf(root)).refused).toMatch(/"widgets", which is not a Tessera entry point/);
    expect(readCopyMap(mapOf(mapRepo({ entries: {} }))).refused).toMatch(/at least one folder/);
    expect(readCopyMap(mapOf(mapRepo({ from: 'next', entries: { ui: 'data' } }))).refused).toMatch(/"from" must be a Tessera version/);
    expect(readCopyMap(mapOf(mapRepo({ entries: { ui: 'data' }, attributes: { Counter: 'small' } }))).refused).toMatch(/"attributes"/);
  });

  it('stops migrate without a map, or on an unusable one, before it touches a file', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = repo({ 'package.json': { name: 'sample-app' }, [`${COPY}/primitives/index.ts`]: 'export const Box = 1;\n', [VIEW]: VIEW_SOURCE, [MAP_FILE]: { entries: { primitives: 'widgets' } } });
    expect(await runMigrate({ rootDir: root, tesseraFromCopy: COPY })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('needs --map <file>'));
    expect(await runMigrate({ rootDir: root, tesseraFromCopy: COPY, map: mapOf(root) })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('is not usable'));
    expect(readFileSync(join(root, VIEW), 'utf8')).toBe(VIEW_SOURCE);
  });
});
