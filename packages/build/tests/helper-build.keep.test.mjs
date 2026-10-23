/* @layer tooling-scripts @kind test */
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { bundleHelperScripts } from '../src/helper-scripts/bundle-helper-scripts.mjs';
import { helperEntries } from '../src/helper-scripts/helper-entries.mjs';
import { helperResources } from '../src/helper-scripts/helper-resources.mjs';

const { tempDir, put, cleanup } = tempTree('brock-helpers-');
const children = [];

afterEach(() => {
  for (const child of children.splice(0)) child.kill();
  cleanup();
});

const realVite = pathToFileURL(createRequire(import.meta.url).resolve('vite')).href;
const bridgeEntry = resolve(import.meta.dirname, '../../electron/src/bridge/index.ts').replace(/\\/g, '/');

const SERVER = [
  `import { startBridgeServer } from '${bridgeEntry}';`,
  "import { writeFileSync } from 'node:fs';",
  "import { ADD } from './route';",
  "const server = await startBridgeServer({ app: 'demo' });",
  'server.handle(ADD, (a: number, b: number) => a + b);',
  'const discovery = { v: 1, app: "demo", pid: process.pid, endpoint: server.endpoint, secret: server.secret, startedAt: "now" };',
  'writeFileSync(process.argv[2] as string, JSON.stringify(discovery), { mode: 0o600 });',
  "process.stdout.write('ready\\n');",
  '',
].join('\n');

const CLIENT = [
  `import { connectBridge } from '${bridgeEntry}';`,
  "import { ADD } from './route';",
  "const bridge = connectBridge({ app: 'demo' });",
  'process.stdout.write(`sum ${await bridge.request(ADD, 20, 22)}`);',
  'bridge.close();',
  '',
].join('\n');

const fixtureApp = (helpers, files = {}) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'fixture-app', type: 'module' }));
  put(root, 'brock.config.ts', `export default ${JSON.stringify({ product: { id: 'fixture-app', name: 'Fixture' }, helpers })};\n`);
  put(root, 'node_modules/vite/package.json', JSON.stringify({ name: 'vite', type: 'module', main: 'index.mjs' }));
  put(root, 'node_modules/vite/index.mjs', `export { build } from '${realVite}';\n`);
  for (const [file, text] of Object.entries(files)) put(root, file, text);
  return root;
};

const startServer = (script, discovery) => new Promise((resolveReady, reject) => {
  const child = spawn(process.execPath, [script, discovery], { stdio: ['ignore', 'pipe', 'inherit'] });
  children.push(child);
  child.stdout.once('data', () => resolveReady(child));
  child.once('exit', (code) => reject(new Error(`the server helper exited with ${code}`)));
});

describe('brock.config.ts helpers', () => {
  it('bundles each helper into one standalone Node file that talks over the bridge', async () => {
    const root = fixtureApp({ 'demo-server': 'src/helper/server.ts', 'demo-client': 'src/helper/client.ts' }, {
      'src/helper/route.ts': "export const ADD = { kind: 'invoke', channel: 'demo:add' } as const;\n",
      'src/helper/server.ts': SERVER,
      'src/helper/client.ts': CLIENT,
    });
    const config = { helpers: { 'demo-server': 'src/helper/server.ts', 'demo-client': 'src/helper/client.ts' } };
    expect(await bundleHelperScripts(root, config)).toEqual(['demo-server', 'demo-client']);
    const out = join(root, 'dist/helpers');
    expect(readdirSync(out).sort()).toEqual(['demo-client.mjs', 'demo-server.mjs']);
    const bundled = readFileSync(join(out, 'demo-client.mjs'), 'utf8');
    expect([...bundled.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(([, spec]) => spec).every((spec) => spec.startsWith('node:') || !spec.includes('/'))).toBe(true);
    const discovery = join(root, 'bridge.json');
    await startServer(join(out, 'demo-server.mjs'), discovery);
    const answer = execFileSync(process.execPath, [join(out, 'demo-client.mjs')], { encoding: 'utf8', timeout: 20000, env: { ...process.env, BROCK_BRIDGE_FILE: discovery } });
    expect(answer).toBe('sum 42');
  }, 120000);

  it('refuses a helper that imports Electron', async () => {
    const root = fixtureApp({ bad: 'src/bad.ts' }, { 'src/bad.ts': "import { app } from 'electron';\nconsole.log(app);\n" });
    await expect(bundleHelperScripts(root, { helpers: { bad: 'src/bad.ts' } })).rejects.toThrow('cannot import "electron"');
  }, 60000);

  it('checks the names and entries and ships the built files as resources', () => {
    const root = fixtureApp({}, { 'src/helper/main.ts': 'export {};\n' });
    expect(helperEntries(root, undefined)).toEqual([]);
    expect(() => helperEntries(root, { Bad_Name: 'src/helper/main.ts' })).toThrow('not a helper name');
    expect(() => helperEntries(root, { mcp: '../outside.ts' })).toThrow('leaves the app folder');
    expect(() => helperEntries(root, { mcp: 'src/helper/missing.ts' })).toThrow('does not exist');
    expect(() => helperEntries(root, { mcp: 'src/helper/main.json' })).toThrow('names a .ts');
    expect(helperResources(root, { mcp: 'src/helper/main.ts' })).toEqual([{ from: 'dist/helpers', to: 'helpers', filter: ['mcp.mjs'] }]);
    expect(helperResources(root, undefined)).toEqual([]);
  });
});
