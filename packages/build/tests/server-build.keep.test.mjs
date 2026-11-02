/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { bundleServer } from '../src/platforms/server/bundle-server.mjs';
import { serverEntry } from '../src/platforms/server/server-entry.mjs';
import { SERVER_CONFIG, buildRaw, cleanup, fixtureApp, serverApp } from './server-fixture.mjs';

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

describe('E2 the server bundle', () => {
  it('builds the entry into one standalone Node file with the aliases, the define and every dependency inlined', { tags: ['e2e'] }, async () => {
    const root = serverApp();
    expect(await bundleServer(root, SERVER_CONFIG, 'test')).toBe(true);
    const out = join(root, 'dist/server');
    expect(readdirSync(out)).toEqual(['main.mjs']);
    const bundled = readFileSync(join(out, 'main.mjs'), 'utf8');
    expect([...bundled.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(([, spec]) => spec).every((spec) => spec.startsWith('node:'))).toBe(true);
    const printed = execFileSync(process.execPath, [join(out, 'main.mjs')], { encoding: 'utf8', timeout: 20000 });
    expect(printed).toBe('started HELLO from-src b42\n');
  });

  it('refuses an Electron import', { tags: ['e2e'] }, async () => {
    const root = serverApp({ 'server/main.ts': "import { app } from 'electron';\nconsole.log(app);\n" });
    await expect(buildRaw(root)).rejects.toThrow('the server runs as plain Node and cannot import "electron"');
    expect(await bundleServer(root, SERVER_CONFIG, 'test')).toBe(false);
  });

  it('refuses a native .node addon and the loaders that find one', { tags: ['e2e'] }, async () => {
    const addon = serverApp({ 'server/main.ts': "import native from './native.node';\nconsole.log(native);\n", 'server/native.node': 'MZ' });
    await expect(buildRaw(addon)).rejects.toThrow('native addon "./native.node"');
    const loader = serverApp({ 'server/main.ts': "import bindings from 'bindings';\nconsole.log(bindings);\n" });
    await expect(buildRaw(loader)).rejects.toThrow('A native .node addon is not supported in a server app');
  });

  it('refuses an unlisted package that loads an addon and names the package and server.optionalAddons', { tags: ['e2e'] }, async () => {
    const native = serverApp({ ...OPTIONAL_ADDON_FILES, 'server/main.ts': "import native from 'optional-native';\nconsole.log(native.loaded());\n" });
    await expect(buildRaw(native)).rejects.toThrow('in the package "optional-native"');
    await expect(buildRaw(native)).rejects.toThrow('server.optionalAddons');
    const loader = serverApp({ ...OPTIONAL_LOADER_FILES, 'server/main.ts': "import loader from 'optional-loader';\nconsole.log(loader.loaded());\n" });
    await expect(buildRaw(loader)).rejects.toThrow('in the package "optional-loader"');
  });

  it('replaces the addon of a listed package with a module that throws, so the package catch runs and no binary is bundled', { tags: ['e2e'] }, async () => {
    const config = { ...SERVER_CONFIG, server: { optionalAddons: ['optional-native', 'optional-loader'] } };
    const root = fixtureApp(config, { ...OPTIONAL_ADDON_FILES, ...OPTIONAL_LOADER_FILES, 'server/main.ts': OPTIONAL_MAIN });
    expect(await bundleServer(root, config, 'test')).toBe(true);
    const out = join(root, 'dist/server');
    expect(readdirSync(out)).toEqual(['main.mjs']);
    expect(execFileSync(process.execPath, [join(out, 'main.mjs')], { encoding: 'utf8', timeout: 20000 })).toBe('native=false loader=false\n');
  });

  it('K4 checks the entry name and file', { tags: ['critical'] }, () => {
    const root = fixtureApp(SERVER_CONFIG, { 'server/main.ts': 'export {};\n' });
    expect(serverEntry(root, undefined)).toBe(resolve(root, 'server/main.ts'));
    expect(() => serverEntry(root, { entry: 'server/main.json' })).toThrow('names a .ts');
    expect(() => serverEntry(root, { entry: '../outside.ts' })).toThrow('leaves the app folder');
    expect(() => serverEntry(root, { entry: 'server/missing.ts' })).toThrow('does not exist');
  });
});
