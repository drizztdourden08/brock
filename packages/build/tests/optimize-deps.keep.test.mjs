/* @layer tooling-scripts @kind test */
import { mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { optimizeDepsPlugin } from '../src/optimize-deps/optimize-deps-plugin.mjs';
import { optimizeDepsOptions, rendererOptimizeDeps } from '../src/optimize-deps/renderer-optimize-deps.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-optimize-deps-');

afterEach(cleanup);

const json = (value) => JSON.stringify(value);

const putPackage = (dir, name, pkg, files = {}) => {
  put(dir, `node_modules/${name}/package.json`, json({ name, ...pkg }));
  for (const [path, content] of Object.entries(files)) put(dir, `node_modules/${name}/${path}`, content);
};

const RENDERER_SOURCE = [
  "import { createRoot } from 'react-dom/client';",
  "import { Button } from '@drizztdourden08/tessera/primitives';",
  "import '@drizztdourden08/tessera/tokens.css';",
  "import gear from '@iconify-icons/ph/gear';",
  "import type { IconifyIcon } from '@iconify/types';",
  "import { readFile } from 'node:fs/promises';",
  "import { ipcRenderer } from 'electron';",
  "import AssetWorker from './jobs/asset.worker?worker';",
  "import { shared } from '@app/shared';",
  "import { lib } from '@scope/lib';",
  "const later = () => import('lazy-dep');",
].join('\n');

const fixtureApp = () => {
  const root = tempDir();
  put(root, 'package.json', json({ name: 'fixture-app', type: 'module', dependencies: { '@drizztdourden08/brock-react': '^1.0.0', '@drizztdourden08/brock-tools': '^1.0.0', '@scope/lib': 'workspace:*' } }));
  put(root, 'src/main.tsx', RENDERER_SOURCE);
  put(root, 'src/shared.ts', "export { pick } from 'small-dep/pick';\nexport const shared = 1;\n");
  put(root, 'src/jobs/asset.worker.ts', "import { load } from 'js-yaml';\n");
  put(root, 'src/main.test.ts', "import { it } from 'vitest';\n");
  putPackage(root, 'react', { exports: { '.': './index.js', './jsx-runtime': './jsx-runtime.js', './jsx-dev-runtime': './jsx-dev-runtime.js' } }, { 'index.js': '', 'jsx-runtime.js': '', 'jsx-dev-runtime.js': '' });
  putPackage(root, 'react-dom', { exports: { '.': './index.js', './client': './client.js' } }, { 'index.js': '', 'client.js': '' });
  putPackage(root, '@drizztdourden08/tessera', {
    exports: { '.': './dist/index.js', './primitives': './dist/primitives.js', './config': './dist/config.js', './tokens.css': './tokens.css', './palettes/*': './palettes/*', './standards.extension.mjs': './x.mjs' },
  }, { 'dist/index.js': '', 'dist/primitives.js': '', 'dist/config.js': '', 'tokens.css': '', 'x.mjs': '' });
  putPackage(root, '@drizztdourden08/brock-react', { exports: { '.': './src/index.ts', './package.json': './package.json' } }, { 'src/index.ts': '' });
  putPackage(root, '@drizztdourden08/brock-tools', { exports: { '.': './src/index.ts', './main': './src/main/index.ts', './renderer': './src/renderer/index.ts' } }, { 'src/index.ts': '', 'src/main/index.ts': '', 'src/renderer/index.ts': '' });
  putPackage(root, '@iconify-icons/ph', {}, { 'gear.js': '' });
  putPackage(root, '@iconify/types', { types: './types.d.ts' }, { 'types.d.ts': '' });
  putPackage(root, 'js-yaml', { main: './index.js' }, { 'index.js': '' });
  putPackage(root, 'lazy-dep', { module: './index.mjs' }, { 'index.mjs': '' });
  putPackage(root, 'small-dep', { exports: { './*': './lib/*.js' } }, { 'lib/pick.js': '' });
  const lib = tempDir();
  put(lib, 'package.json', json({ name: '@scope/lib', exports: { '.': './src/index.ts' } }));
  put(lib, 'src/index.ts', "import { z } from 'zod';\nexport { helper } from './helper';\n");
  put(lib, 'src/helper.ts', "import { fromRoot } from 'js-yaml';\n");
  putPackage(lib, 'zod', { exports: { '.': './index.js' } }, { 'index.js': '' });
  mkdirSync(join(root, 'node_modules/@scope'), { recursive: true });
  symlinkSync(lib, join(root, 'node_modules/@scope/lib'), 'junction');
  return root;
};

const aliasesOf = (root) => ({ '@app': resolve(root, 'src') });

describe('the computed renderer optimizeDeps', () => {
  it('lists React, the renderer entries of installed Brock and Tessera packages, and what the source imports from node_modules', async () => {
    const root = fixtureApp();
    const { include, exclude, entries } = await rendererOptimizeDeps(root, aliasesOf(root), undefined);
    expect(include).toEqual([
      '@drizztdourden08/brock-react',
      '@drizztdourden08/brock-tools',
      '@drizztdourden08/brock-tools/renderer',
      '@drizztdourden08/tessera',
      '@drizztdourden08/tessera/primitives',
      '@iconify-icons/ph/gear',
      '@scope/lib > zod',
      'js-yaml',
      'lazy-dep',
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
      'small-dep/pick',
    ]);
    expect(exclude).toBeUndefined();
    expect(entries).toBeUndefined();
  });

  it('adds the app include and worker lists, drops what exclude names, and passes entries through', async () => {
    const root = fixtureApp();
    const options = { include: ['extra-dep'], exclude: ['js-yaml', 'zod'], entries: ['src/other.html'], worker: ['fs', 'crypto'] };
    const result = await rendererOptimizeDeps(root, aliasesOf(root), options);
    expect(result.include).toContain('extra-dep');
    expect(result.include).toContain('fs');
    expect(result.include).toContain('crypto');
    expect(result.include).not.toContain('js-yaml');
    expect(result.include).not.toContain('@scope/lib > zod');
    expect(result.exclude).toEqual(['js-yaml', 'zod']);
    expect(result.entries).toEqual(['src/other.html']);
  });

  it('reuses the last crawl while no file it read changed, and crawls again after an edit', async () => {
    const root = fixtureApp();
    await rendererOptimizeDeps(root, aliasesOf(root), undefined);
    const cacheFile = join(root, 'node_modules/.vite/brock-renderer-deps.json');
    const cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
    writeFileSync(cacheFile, JSON.stringify({ ...cache, specs: ['kept-from-cache'] }));
    expect((await rendererOptimizeDeps(root, aliasesOf(root), undefined)).include).toEqual(['kept-from-cache']);
    putPackage(root, 'new-dep', { main: './index.js' }, { 'index.js': '' });
    put(root, 'src/shared.ts', "export { pick } from 'small-dep/pick';\nexport { added } from 'new-dep';\nexport const shared = 1;\n");
    const { include } = await rendererOptimizeDeps(root, aliasesOf(root), undefined);
    expect(include).toContain('new-dep');
    expect(include).not.toContain('kept-from-cache');
  });

  it('refuses an unknown key and a list that is not of specifiers', () => {
    expect(optimizeDepsOptions(undefined)).toEqual({ include: [], exclude: [], entries: [], worker: [] });
    expect(() => optimizeDepsOptions({ includes: ['x'] })).toThrow(/includes is not an option/);
    expect(() => optimizeDepsOptions({ worker: 'fs' })).toThrow(/build\.optimizeDeps\.worker takes a list/);
    expect(() => optimizeDepsOptions(['x'])).toThrow(/takes \{ include, exclude, entries, worker \}/);
  });
});

describe('optimizeDepsPlugin', () => {
  it('sets optimizeDeps on the dev server only, and names the optimizer metadata for the Electron app', async () => {
    const root = fixtureApp();
    const plugin = optimizeDepsPlugin({ rootDir: root, aliases: aliasesOf(root), options: { worker: ['fs'] } });
    expect(await plugin.config({}, { command: 'build' })).toBeNull();
    const served = await plugin.config({}, { command: 'serve' });
    expect(served.optimizeDeps.include).toContain('fs');
    plugin.configResolved({ command: 'serve', cacheDir: join(root, 'node_modules/.vite') });
    expect(process.env.BROCK_DEV_DEPS_METADATA).toBe(join(root, 'node_modules/.vite/deps/_metadata.json'));
    delete process.env.BROCK_DEV_DEPS_METADATA;
  });
});
