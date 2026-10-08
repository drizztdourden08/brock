/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { appAliases } from '../src/build-options/app-aliases.mjs';
import { WORKER_FORMAT } from '../src/build-options/build-options.constants.mjs';
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

describe('build.aliases', () => {
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
    expect(withAliases).toContain('      "@app/*": ["./src/*"],\n      "@shared/*": ["../../shared/*"],\n      "@domains/*": ["./src/ui/domains/*"],\n');
    expect(JSON.parse(withAliases).compilerOptions.paths['@shared/*']).toEqual(['../../shared/*']);
  });
});

describe('build.nodePolyfills', () => {
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

describe('defineBrockViteConfig', () => {
  it('gives every side the aliases, the renderer and its workers the polyfills, and workers the ES format', async () => {
    const root = fixtureApp({ build: { aliases: { '@shared': '../shared' }, nodePolyfills: { globals: { Buffer: true, process: true } } } });
    const config = await defineBrockViteConfig(root);
    for (const side of ['main', 'preload', 'renderer']) expect(config[side].resolve.alias).toMatchObject({ '@app': resolve(root, 'src'), '@shared': resolve(root, '../shared') });
    expect(pluginNames(config.renderer.plugins)).toEqual(expect.arrayContaining(['brock-dev-only', 'react-stub', 'node-polyfills-stub']));
    expect(pluginNames(config.main.plugins)).toEqual(['brock-dev-only']);
    expect(config.renderer.worker.format).toBe(WORKER_FORMAT);
    expect(pluginNames(config.renderer.worker.plugins())).toEqual(['brock-dev-only', 'node-polyfills-stub']);
    expect(config.renderer.publicDir).toBe(resolve(root, 'public'));
  });

  it('leaves the polyfills out by default', async () => {
    const config = await defineBrockViteConfig(fixtureApp({}));
    expect(pluginNames(config.renderer.plugins)).not.toContain('node-polyfills-stub');
    expect(pluginNames(config.renderer.worker.plugins())).toEqual(['brock-dev-only']);
  });
});

describe('a renderer build with a module worker, an extra alias and public/wasm', () => {
  it('bundles a worker that imports through an alias and splits a dynamic import, and copies the wasm folder', async () => {
    const root = tempDir();
    put(root, 'shared/scale.ts', 'export const scale = (n: number): number => n * 3;\n');
    put(root, 'src/lazy.ts', "export const lazyMark = 'lazy-chunk-mark';\n");
    put(root, 'src/job.worker.ts', "import { scale } from '@shared/scale';\nself.onmessage = async (event) => {\n  const { lazyMark } = await import('./lazy');\n  self.postMessage([scale(event.data), lazyMark]);\n};\n");
    put(root, 'src/main.ts', "const worker = new Worker(new URL('./job.worker.ts', import.meta.url), { type: 'module' });\nworker.postMessage(2);\n");
    put(root, 'public/wasm/core.wasm', '\0asm');
    const outDir = join(root, 'dist');
    await build({
      root: join(root, 'src'),
      publicDir: join(root, 'public'),
      logLevel: 'silent',
      configFile: false,
      resolve: { alias: appAliases(root, { aliases: { '@shared': 'shared' } }) },
      worker: { format: WORKER_FORMAT },
      build: { outDir, emptyOutDir: true, rollupOptions: { input: join(root, 'src/main.ts') } },
    });
    const assets = readdirSync(join(outDir, 'assets'));
    const code = assets.map((file) => readFileSync(join(outDir, 'assets', file), 'utf8')).join('\n');
    expect(assets.some((file) => file.startsWith('job.worker'))).toBe(true);
    expect(code).toContain('lazy-chunk-mark');
    expect(code).toMatch(/\*\s*3|3\s*\*/);
    expect(existsSync(join(outDir, 'wasm', 'core.wasm'))).toBe(true);
  });
});
