/* @layer tooling-scripts @kind test */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { appAliases } from '../src/build-options/app-aliases.mjs';
import { WORKER_FORMAT } from '../src/build-options/build-options.constants.mjs';
import { defineValues } from '../src/build-options/define-values.mjs';
import { polyfillShimAliases } from '../src/build-options/polyfill-shim-aliases.mjs';
import { nodePolyfillPlugins } from '../src/build-options/node-polyfills.mjs';
import { renderManagedFiles } from '../src/managed/templates.mjs';
import { defineBrockViteConfig } from '../src/vite-config.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-options-');

afterEach(cleanup);

const realVite = pathToFileURL(createRequire(import.meta.url).resolve('vite')).href;

const POLYFILLS = 'export const nodePolyfills = (options) => ({ name: "node-polyfills-stub", options });\n';

const fixtureApp = (config) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'fixture-app', type: 'module' }));
  put(root, 'brock.config.ts', `export default ${JSON.stringify({ product: { id: 'fixture-app', name: 'Fixture', ports: { base: 41000 } }, ...config })};\n`);
  put(root, 'node_modules/vite/package.json', JSON.stringify({ name: 'vite', type: 'module', main: 'index.mjs' }));
  put(root, 'node_modules/vite/index.mjs', `export { mergeConfig, searchForWorkspaceRoot } from '${realVite}';\n`);
  put(root, 'node_modules/@vitejs/plugin-react/package.json', JSON.stringify({ name: '@vitejs/plugin-react', type: 'module', main: 'index.mjs' }));
  put(root, 'node_modules/@vitejs/plugin-react/index.mjs', 'export default () => ({ name: "react-stub" });\n');
  put(root, 'node_modules/vite-plugin-node-polyfills/package.json', JSON.stringify({ name: 'vite-plugin-node-polyfills', type: 'module', main: 'index.mjs' }));
  put(root, 'node_modules/vite-plugin-node-polyfills/index.mjs', POLYFILLS);
  return root;
};

const pluginNames = (plugins) => plugins.flat().map((plugin) => plugin?.name);

describe('K1 build.aliases', { tags: ['critical'] }, () => {
  it('keeps @app on src and resolves each extra alias from the app folder', () => {
    const root = tempDir();
    expect(appAliases(root, undefined)).toEqual({ '@app': resolve(root, 'src') });
    expect(appAliases(root, { aliases: { '@shared': '../../shared', '@ds': 'src/ui/design-system' } })).toEqual({
      '@app': resolve(root, 'src'),
      '@shared': resolve(root, '../../shared'),
      '@ds': resolve(root, 'src/ui/design-system'),
    });
  });

  it('refuses @app, an absolute folder and a name that is not an import prefix', () => {
    const root = tempDir();
    expect(() => appAliases(root, { aliases: { '@app': 'lib' } })).toThrow(/Brock's own alias/);
    expect(() => appAliases(root, { aliases: { '@shared': resolve(root, 'shared') } })).toThrow(/absolute/);
    expect(() => appAliases(root, { aliases: { 'two words': 'x' } })).toThrow(/not an import prefix/);
  });

  it('adds each alias to the managed tsconfig paths after @app, and leaves the file alone without one', () => {
    const plain = renderManagedFiles().find((file) => file.path === 'tsconfig.json').content;
    const withAliases = renderManagedFiles({ aliases: { '@shared': '../../shared/', '@domains': 'src/ui/domains' } }).find((file) => file.path === 'tsconfig.json').content;
    expect(renderManagedFiles({ aliases: {} }).find((file) => file.path === 'tsconfig.json').content).toBe(plain);
    expect(JSON.parse(withAliases).compilerOptions.paths['@shared/*']).toEqual(['../../shared/*']);
  });
});

describe('K1 build.define', { tags: ['critical'] }, () => {
  it('turns each value into the JSON expression Vite replaces it with', () => {
    expect(defineValues(undefined, 'brock.config.ts')).toEqual({});
    expect(defineValues({ __A__: 'x', __B__: null, __C__: [1, 'two'] }, 'brock.config.ts')).toEqual({ __A__: '"x"', __B__: 'null', __C__: '[1,"two"]' });
  });

  it('refuses a name that is not a global and a value that is not JSON', () => {
    expect(() => defineValues({ 'two words': 1 }, 'brock.config.ts')).toThrow(/not a global name/);
    expect(() => defineValues({ __F__: () => 1 }, 'brock.site.ts')).toThrow(/brock\.site\.ts build\.define: __F__ must be a JSON value/);
    expect(() => defineValues({ __N__: Number.NaN }, 'brock.config.ts')).toThrow(/JSON value/);
    expect(() => defineValues(['x'], 'brock.config.ts')).toThrow(/maps a global name/);
  });
});

describe('K1 build.nodePolyfills', { tags: ['critical'] }, () => {
  it('gives no plugin when off, and a fresh one per call with the options when on', async () => {
    const root = fixtureApp({});
    expect((await nodePolyfillPlugins(root, undefined))()).toEqual([]);
    expect((await nodePolyfillPlugins(root, { nodePolyfills: false }))()).toEqual([]);
    const make = await nodePolyfillPlugins(root, { nodePolyfills: { globals: { Buffer: true } } });
    expect(make()).toEqual([{ name: 'node-polyfills-stub', options: { globals: { Buffer: true } } }]);
    expect(make()[0]).not.toBe(make()[0]);
    expect((await nodePolyfillPlugins(root, { nodePolyfills: true }))()[0].options).toEqual({});
  });

  it('names the package to add when the app lacks it', async () => {
    const root = tempDir();
    put(root, 'package.json', '{}');
    await expect(nodePolyfillPlugins(root, { nodePolyfills: true })).rejects.toThrow(/pnpm add -D vite-plugin-node-polyfills/);
  });
});

describe('K1 polyfill shim aliases', { tags: ['critical'] }, () => {
  it('pins each shim the app has to its copy, exact match only, and skips the rest', () => {
    const root = fixtureApp({});
    for (const shim of ['buffer', 'process']) put(root, `node_modules/vite-plugin-node-polyfills/shims/${shim}/index.mjs`, 'export {};\n');
    put(root, 'node_modules/vite-plugin-node-polyfills/package.json', JSON.stringify({ name: 'vite-plugin-node-polyfills', type: 'module', main: 'index.mjs', exports: { '.': './index.mjs', './shims/buffer': './shims/buffer/index.mjs', './shims/process': './shims/process/index.mjs' } }));
    const aliases = polyfillShimAliases(root, { nodePolyfills: true });
    expect(aliases.map((entry) => entry.find.source)).toEqual(['^vite-plugin-node-polyfills/shims/buffer$', '^vite-plugin-node-polyfills/shims/process$']);
    expect(aliases[0].find.test('vite-plugin-node-polyfills')).toBe(false);
    expect(aliases[0].replacement).toBe(resolve(root, 'node_modules/vite-plugin-node-polyfills/shims/buffer/index.mjs'));
    expect(polyfillShimAliases(root, { nodePolyfills: false })).toEqual([]);
  });
});

describe('K2 defineBrockViteConfig', { tags: ['critical'] }, () => {
  it('gives every side the aliases, the renderer and its workers the polyfills, and workers the ES format', async () => {
    const root = fixtureApp({ build: { aliases: { '@shared': '../shared' }, nodePolyfills: { globals: { Buffer: true, process: true } } } });
    const config = await defineBrockViteConfig(root);
    for (const side of ['main', 'preload', 'renderer']) expect(config[side].resolve.alias).toMatchObject({ '@app': resolve(root, 'src'), '@shared': resolve(root, '../shared') });
    expect(pluginNames(config.renderer.plugins)).toEqual(expect.arrayContaining(['brock-dev-only', 'react-stub', 'node-polyfills-stub', 'brock:shared-deps-cache']));
    expect(pluginNames(config.main.plugins)).toEqual(['brock-main-process-guard', 'build-cache:packages', 'brock:build-reuse-main', 'brock-dev-only', 'brock-esm-shim-placement']);
    expect(pluginNames(config.preload.plugins)).toEqual(['brock-main-process-guard', 'brock:build-reuse-preload', 'brock-esm-shim-placement']);
    expect(config.renderer.worker.format).toBe(WORKER_FORMAT);
    expect(pluginNames(config.renderer.worker.plugins())).toEqual(['brock-dev-only', 'node-polyfills-stub']);
    expect(config.renderer.publicDir).toBe(resolve(root, 'public'));
  });

  it('defines build.define on main, preload and the renderer, each value as JSON', async () => {
    const config = await defineBrockViteConfig(fixtureApp({ build: { define: { __APP_BUILD__: '1.2.3', __FLAGS__: { beta: true }, 'globalThis.LIMIT': 4 } } }));
    const expected = { __APP_BUILD__: '"1.2.3"', __FLAGS__: '{"beta":true}', 'globalThis.LIMIT': '4' };
    for (const side of ['main', 'preload', 'renderer']) expect(config[side].define).toEqual(expected);
    expect((await defineBrockViteConfig(fixtureApp({}))).renderer.define).toEqual({});
  });

  it('leaves the polyfills out by default', async () => {
    const config = await defineBrockViteConfig(fixtureApp({}));
    expect(pluginNames(config.renderer.plugins)).not.toContain('node-polyfills-stub');
    expect(pluginNames(config.renderer.worker.plugins())).toEqual(['brock-dev-only']);
  });
});
