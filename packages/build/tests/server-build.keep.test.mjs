/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appAliases } from '../src/build-options/app-aliases.mjs';
import { CJS_GLOBALS_BANNER, CJS_GLOBALS_DEFINE } from '../src/build-options/build-options.constants.mjs';
import { defineValues } from '../src/build-options/define-values.mjs';
import { bundleHelperScripts } from '../src/helper-scripts/bundle-helper-scripts.mjs';
import { helperViteConfig } from '../src/helper-scripts/helper-vite-config.mjs';
import { bundleServer } from '../src/platforms/server/bundle-server.mjs';
import { serverEntry } from '../src/platforms/server/server-entry.mjs';
import { serverViteConfig } from '../src/platforms/server/server-vite-config.mjs';
import { SERVER_CONFIG, buildRaw, cleanup, fixtureApp, realVite, serverApp } from './server-fixture.mjs';

afterEach(cleanup);

const packageFiles = (name, source) => ({
  [`node_modules/${name}/package.json`]: JSON.stringify({ name, main: 'index.js' }),
  [`node_modules/${name}/index.js`]: source,
});

const OPTIONAL_ADDON_FILES = packageFiles('optional-native', [
  'let binding = null;',
  "try { binding = require('./build/Release/addon.node'); } catch { binding = null; }",
  'module.exports = { loaded: () => binding !== null };',
  '',
].join('\n'));

const OPTIONAL_LOADER_FILES = packageFiles('optional-loader', [
  'let binding = null;',
  "try { binding = require('bindings')('addon'); } catch { binding = null; }",
  'module.exports = { loaded: () => binding !== null };',
  '',
].join('\n'));

const OPTIONAL_MAIN = [
  "import native from 'optional-native';",
  "import loader from 'optional-loader';",
  'process.stdout.write(`native=${native.loaded()} loader=${loader.loaded()}\\n`);',
  '',
].join('\n');

describe('the server bundle', () => {
  it('builds the entry into one standalone Node file with the aliases, the define and every dependency inlined', async () => {
    const root = serverApp();
    expect(await bundleServer(root, SERVER_CONFIG, 'test')).toBe(true);
    const out = join(root, 'dist/server');
    expect(readdirSync(out)).toEqual(['main.mjs']);
    const bundled = readFileSync(join(out, 'main.mjs'), 'utf8');
    expect([...bundled.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(([, spec]) => spec).every((spec) => spec.startsWith('node:'))).toBe(true);
    const printed = execFileSync(process.execPath, [join(out, 'main.mjs')], { encoding: 'utf8', timeout: 20000 });
    expect(printed).toBe('started HELLO from-src b42\n');
  }, 120000);

  it('honours server.entry', async () => {
    const config = { ...SERVER_CONFIG, server: { entry: 'src/boot-server.ts' } };
    const root = fixtureApp(config, { 'src/boot-server.ts': "process.stdout.write('custom');\n" });
    expect(await bundleServer(root, config, 'test')).toBe(true);
    expect(execFileSync(process.execPath, [join(root, 'dist/server/main.mjs')], { encoding: 'utf8' })).toBe('custom');
  }, 60000);

  it('refuses an Electron import', async () => {
    const root = serverApp({ 'server/main.ts': "import { app } from 'electron';\nconsole.log(app);\n" });
    await expect(buildRaw(root)).rejects.toThrow('the server runs as plain Node and cannot import "electron"');
    expect(await bundleServer(root, SERVER_CONFIG, 'test')).toBe(false);
  }, 60000);

  it('refuses a native .node addon and the loaders that find one', async () => {
    const addon = serverApp({ 'server/main.ts': "import native from './native.node';\nconsole.log(native);\n", 'server/native.node': 'MZ' });
    await expect(buildRaw(addon)).rejects.toThrow('native addon "./native.node"');
    const loader = serverApp({ 'server/main.ts': "import bindings from 'bindings';\nconsole.log(bindings);\n" });
    await expect(buildRaw(loader)).rejects.toThrow('A native .node addon is not supported in a server app');
  }, 60000);

  it('refuses an unlisted package that loads an addon and names the package and server.optionalAddons', async () => {
    const native = serverApp({ ...OPTIONAL_ADDON_FILES, 'server/main.ts': "import native from 'optional-native';\nconsole.log(native.loaded());\n" });
    await expect(buildRaw(native)).rejects.toThrow('in the package "optional-native"');
    await expect(buildRaw(native)).rejects.toThrow('server.optionalAddons');
    const loader = serverApp({ ...OPTIONAL_LOADER_FILES, 'server/main.ts': "import loader from 'optional-loader';\nconsole.log(loader.loaded());\n" });
    await expect(buildRaw(loader)).rejects.toThrow('in the package "optional-loader"');
  }, 60000);

  it('replaces the addon of a listed package with a module that throws, so the package catch runs and no binary is bundled', async () => {
    const config = { ...SERVER_CONFIG, server: { optionalAddons: ['optional-native', 'optional-loader'] } };
    const root = fixtureApp(config, { ...OPTIONAL_ADDON_FILES, ...OPTIONAL_LOADER_FILES, 'server/main.ts': OPTIONAL_MAIN });
    expect(await bundleServer(root, config, 'test')).toBe(true);
    const out = join(root, 'dist/server');
    expect(readdirSync(out)).toEqual(['main.mjs']);
    expect(execFileSync(process.execPath, [join(out, 'main.mjs')], { encoding: 'utf8', timeout: 20000 })).toBe('native=false loader=false\n');
  }, 120000);

  it('keeps refusing an addon the app itself loads, even when a package is listed', async () => {
    const config = { ...SERVER_CONFIG, server: { optionalAddons: ['optional-native'] } };
    const root = fixtureApp(config, { 'server/main.ts': "import native from './native.node';\nconsole.log(native);\n", 'server/native.node': 'MZ' });
    await expect((await import(realVite)).build(serverViteConfig(root, config))).rejects.toThrow('native addon "./native.node"');
  }, 60000);

  it('checks the entry name and file', () => {
    const root = fixtureApp(SERVER_CONFIG, { 'server/main.ts': 'export {};\n' });
    expect(serverEntry(root, undefined)).toBe(resolve(root, 'server/main.ts'));
    expect(() => serverEntry(root, { entry: 'server/main.json' })).toThrow('names a .ts');
    expect(() => serverEntry(root, { entry: '../outside.ts' })).toThrow('leaves the app folder');
    expect(() => serverEntry(root, { entry: 'server/missing.ts' })).toThrow('does not exist');
  });
});

describe('the helper bundle', () => {
  it('writes the same bytes through the shared node bundle config as through the config it replaced plus the CommonJS globals', async () => {
    const root = fixtureApp({ helpers: { demo: 'src/helper.ts' } }, {
      'src/helper.ts': "import { shout } from 'shout';\nimport { greeting } from '@shared/greeting';\nprocess.stdout.write(shout(greeting) + __BUILD__);\n",
      'shared/greeting.ts': "export const greeting = 'hi';\n",
    });
    const config = { helpers: { demo: 'src/helper.ts' }, build: SERVER_CONFIG.build };
    await bundleHelperScripts(root, config);
    const now = readFileSync(join(root, 'dist/helpers/demo.mjs'), 'utf8');
    const vite = await import(realVite);
    const entry = resolve(root, 'src/helper.ts');
    const current = helperViteConfig(root, config.build, { name: 'demo', entry });
    const legacy = {
      configFile: false,
      root,
      publicDir: false,
      logLevel: 'warn',
      mode: 'production',
      plugins: [],
      resolve: { alias: appAliases(root, config.build) },
      define: { ...CJS_GLOBALS_DEFINE, ...defineValues(config.build.define, 'brock.config.ts') },
      ssr: { noExternal: true, target: 'node' },
      build: {
        ssr: entry,
        outDir: resolve(root, 'dist/legacy'),
        emptyOutDir: false,
        target: 'node22',
        minify: false,
        sourcemap: false,
        rollupOptions: { output: { format: 'es', banner: CJS_GLOBALS_BANNER, entryFileNames: 'demo.mjs', inlineDynamicImports: true } },
      },
    };
    expect({ ...current, plugins: [], build: { ...current.build, outDir: legacy.build.outDir } }).toEqual(legacy);
    await vite.build(legacy);
    expect(readFileSync(join(root, 'dist/legacy/demo.mjs'), 'utf8')).toBe(now);
  }, 120000);
});
