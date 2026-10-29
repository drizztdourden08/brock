/* @layer tooling-scripts @kind test */
import { mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { codeExports, exportKeyOf } from '../src/packages/code-exports.mjs';
import { packageBuildKey } from '../src/packages/compile-package.mjs';
import { packageClosure } from '../src/packages/package-closure.mjs';
import { servePackage } from '../src/packages/serve-package.mjs';
import { cacheRoot } from '../src/store/cache-root.mjs';
import { commitEntry } from '../src/store/commit-entry.mjs';
import { entryPaths } from '../src/store/entry-path.mjs';
import { hashTree } from '../src/store/hash-tree.mjs';
import { listEntries } from '../src/store/list-entries.mjs';
import { readEntry, touchEntry } from '../src/store/read-entry.mjs';
import { runtimeImportsOf } from '../src/vite/serve-closure.mjs';
import { cacheTestTree, sourcePackage } from './cache-test-tree.mjs';

const { tempDir, put, cleanup } = cacheTestTree('build-cache-');

afterEach(cleanup);

const NAME = '@drizztdourden08/demo';
const KEY = packageBuildKey({ platform: 'node', target: 'node22' });

const installedApp = (files = sourcePackage(NAME)) => {
  const app = tempDir();
  put(app, { 'package.json': JSON.stringify({ name: 'app', dependencies: { [NAME]: '1.2.3' } }) });
  put(join(app, 'node_modules', '@drizztdourden08', 'demo'), files);
  return app;
};

const serve = (root, app) => {
  const source = packageClosure(app, { scope: '@drizztdourden08/' }).get(NAME);
  return servePackage({ root, rootDir: app, source, ...KEY });
};

describe('cacheRoot', () => {
  it('honours BROCK_BUILD_CACHE_DIR and otherwise sits in the home folder', () => {
    expect(cacheRoot({ BROCK_BUILD_CACHE_DIR: '/tmp/x' })).toMatch(/x$/);
    expect(cacheRoot({})).toMatch(/[\\/]\.brock[\\/]cache[\\/]build-cache$/);
  });
});

describe('hashTree', () => {
  it('hashes contents and relative paths, not where the folder is', () => {
    const one = tempDir();
    const two = tempDir();
    put(one, { 'a/b.txt': 'same' });
    put(two, { 'a/b.txt': 'same' });
    expect(hashTree(one).contentHash).toBe(hashTree(two).contentHash);
    put(two, { 'a/b.txt': 'changed' });
    expect(hashTree(one).contentHash).not.toBe(hashTree(two).contentHash);
  });
});

describe('packageBuildKey', () => {
  it('changes with the settings that change the output', () => {
    expect(packageBuildKey({ platform: 'node', target: 'node22' }).buildKey).toBe(KEY.buildKey);
    expect(packageBuildKey({ platform: 'node', target: 'node20' }).buildKey).not.toBe(KEY.buildKey);
    expect(packageBuildKey({ platform: 'node', target: 'node22', define: { FLAG: 'true' } }).buildKey).not.toBe(KEY.buildKey);
  });
});

describe('codeExports', () => {
  it('serves each export that points at code and refuses a pattern export', () => {
    expect(codeExports({ exports: { '.': './src/index.ts', './main': { types: './x.d.ts', default: './src/main.ts' }, './styles.css': './s.css' } }))
      .toEqual([{ key: '.', file: './src/index.ts', out: 'index' }, { key: './main', file: './src/main.ts', out: 'main' }]);
    expect(codeExports({ exports: { './*': './src/*.ts' } })).toBeNull();
    expect(exportKeyOf(`${NAME}/sub`, NAME)).toBe('./sub');
    expect(exportKeyOf('@drizztdourden08/demo-two', NAME)).toBeNull();
  });
});

describe('servePackage', { timeout: 300_000 }, () => {
  it('builds once, then a copy of the same version at another path is a hit', async () => {
    const root = tempDir();
    const first = await serve(root, installedApp());
    expect(first.built).toBe(true);
    expect(first.imports['.']).toEqual(['left-pad']);
    const app = installedApp();
    const second = await serve(root, app);
    expect(second.built).toBe(false);
    const placed = JSON.parse(readFileSync(join(second.placedDir, 'package.json'), 'utf8'));
    expect(placed.exports).toEqual({ '.': './index.js', './sub': './sub.js', './package.json': './package.json' });
    expect(readFileSync(join(second.placedDir, 'index.js'), 'utf8')).toContain('left-pad');
  });

  it('shares one module between two exports, so state is not duplicated', async () => {
    const { placedDir } = await serve(tempDir(), installedApp());
    expect(readFileSync(join(placedDir, 'sub.js'), 'utf8')).not.toContain('count: 0');
    expect(readdirSync(join(placedDir, 'chunks')).length).toBeGreaterThan(0);
  });

  it('misses when the source content changes under the same version', async () => {
    const root = tempDir();
    await serve(root, installedApp());
    const changed = await serve(root, installedApp(sourcePackage(NAME, { 'src/sub.ts': "export { state } from './state';\nexport const extra = 1;\n" })));
    expect(changed.built).toBe(true);
  });
});

describe('readEntry and commitEntry', () => {
  const id = (root) => ({ root, kind: 'package', name: NAME, version: '1.0.0', buildKey: 'node-abc' });
  const fill = (filesDir) => {
    writeFileSync(join(filesDir, 'index.js'), 'export {};\n');
    return Promise.resolve({ imports: {} });
  };

  it('commits through a temp folder and leaves nothing half written', async () => {
    const root = tempDir();
    const entry = await commitEntry({ ...id(root), inputHash: 'in', fill });
    expect(entry.manifest).toMatchObject({ kind: 'package', name: NAME, version: '1.0.0', buildKey: 'node-abc', inputHash: 'in' });
    expect(entry.manifest.contentHash).toMatch(/^[0-9a-f]{64}$/);
    expect(readdirSync(join(root, '.tmp'))).toEqual([]);
    expect(listEntries(root).map((item) => item.manifest?.name)).toEqual([NAME]);
  });

  it('reads a tampered file, another input hash or a broken manifest as a miss', async () => {
    const root = tempDir();
    await commitEntry({ ...id(root), inputHash: 'in', fill });
    expect(readEntry(id(root), { inputHash: 'other' })).toBeNull();
    const { filesDir, manifestFile } = entryPaths(id(root));
    writeFileSync(join(filesDir, 'index.js'), 'export const changed = 1;\n');
    expect(readEntry(id(root), { inputHash: 'in' })).toBeNull();
    writeFileSync(manifestFile, '{');
    expect(readEntry(id(root))).toBeNull();
  });

  it('rebuilds over a broken entry', async () => {
    const root = tempDir();
    await commitEntry({ ...id(root), inputHash: 'in', fill });
    writeFileSync(entryPaths(id(root)).manifestFile, '{');
    const rebuilt = await commitEntry({ ...id(root), inputHash: 'in', fill });
    expect(readEntry(id(root), { inputHash: 'in' })?.manifest.contentHash).toBe(rebuilt.manifest.contentHash);
  });

  it('records lastUsedAt once per process', async () => {
    const root = tempDir();
    const entry = await commitEntry({ ...id(root), inputHash: 'in', fill });
    touchEntry(entry, () => new Date('2030-01-01T00:00:00Z'));
    touchEntry(entry, () => new Date('2031-01-01T00:00:00Z'));
    expect(readEntry(id(root))?.manifest.lastUsedAt).toBe('2030-01-01T00:00:00.000Z');
  });

  it('refuses a name or version that would leave the cache folder', () => {
    expect(() => entryPaths({ ...id('/c'), version: '..' })).toThrow(/cannot name/);
    expect(() => entryPaths({ ...id('/c'), name: 'a/../../b' })).toThrow(/cannot name/);
  });
});

describe('runtimeImportsOf', () => {
  it('lists the app packages the served exports load, following served packages through', () => {
    const closure = {
      served: new Map([['@s/a', new Map()], ['@s/b', new Map()]]),
      importsOf: new Map([['@s/a', { './main': ['@s/b', 'left-pad'], './other': ['unused'] }], ['@s/b', { '.': ['right-pad'] }]]),
    };
    expect(runtimeImportsOf(new Set(['@s/a|./main']), closure)).toEqual(['left-pad', 'right-pad']);
  });
});

describe('packageClosure', () => {
  it('keeps linked packages, and packages that depend on them, compiled in', () => {
    const app = tempDir();
    const TWO = '@drizztdourden08/demo-two';
    put(app, { 'package.json': JSON.stringify({ name: 'app', dependencies: { [TWO]: '1.2.3' } }) });
    put(join(app, 'checkout', 'demo'), sourcePackage(NAME));
    const twoFiles = sourcePackage(TWO);
    const twoPkg = JSON.parse(twoFiles['package.json']);
    put(join(app, 'node_modules', '@drizztdourden08', 'demo-two'), { ...twoFiles, 'package.json': JSON.stringify({ ...twoPkg, dependencies: { [NAME]: '1.2.3' } }) });
    mkdirSync(join(app, 'node_modules', '@drizztdourden08'), { recursive: true });
    symlinkSync(join(app, 'checkout', 'demo'), join(app, 'node_modules', '@drizztdourden08', 'demo'), 'junction');
    const closure = packageClosure(app, { scope: '@drizztdourden08/' });
    expect(closure.get(NAME)?.problem).toMatch(/linked/);
    expect(closure.get(TWO)?.problem).toMatch(/depends on a package that is not served/);
    expect(packageClosure(installedApp(), { scope: '@drizztdourden08/' }).get(NAME)?.problem).toBeNull();
  });

  it('keeps a UI package out of a Node build', () => {
    const files = sourcePackage(NAME);
    const pkg = JSON.parse(files['package.json']);
    const app = installedApp({ ...files, 'package.json': JSON.stringify({ ...pkg, peerDependencies: { react: '^19.0.0' } }) });
    expect(packageClosure(app, { scope: '@drizztdourden08/', skipUi: true }).get(NAME)?.problem).toMatch(/UI package/);
  });
});
