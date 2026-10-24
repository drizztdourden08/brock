/* @layer tooling-scripts @kind test */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { serverViteConfig } from '../src/platforms/server/server-vite-config.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-server-');

const realVite = pathToFileURL(createRequire(import.meta.url).resolve('vite')).href;

const RUNTIME = [
  'const runServer = (start) => {',
  '  const running = start({ dataDir: "data" });',
  '  process.stdout.write(`started ${running.name}\\n`);',
  '};',
  'export { runServer };',
  '',
].join('\n');

const fixtureApp = (config, files = {}) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'fixture-server', type: 'module' }));
  put(root, 'brock.config.ts', `export default ${JSON.stringify({ product: { id: 'fixture-server', name: 'Fixture' }, ...config })};\n`);
  put(root, 'node_modules/vite/package.json', JSON.stringify({ name: 'vite', type: 'module', main: 'index.mjs' }));
  put(root, 'node_modules/vite/index.mjs', `export { build } from '${realVite}';\n`);
  put(root, 'node_modules/@drizztdourden08/brock-electron/package.json', JSON.stringify({ name: '@drizztdourden08/brock-electron', type: 'module', exports: { './server': './server.mjs' } }));
  put(root, 'node_modules/@drizztdourden08/brock-electron/server.mjs', RUNTIME);
  put(root, 'node_modules/shout/package.json', JSON.stringify({ name: 'shout', main: 'index.js' }));
  put(root, 'node_modules/shout/index.js', 'module.exports = { shout: (text) => text.toUpperCase() };\n');
  for (const [file, text] of Object.entries(files)) put(root, file, text);
  return root;
};

const SERVER_MAIN = [
  "import { runServer } from '@drizztdourden08/brock-electron/server';",
  "import { shout } from 'shout';",
  "import { greeting } from '@shared/greeting';",
  "import { label } from '@app/label';",
  'runServer(() => ({ name: `${shout(greeting)} ${label} ${__BUILD__}`, stop: async () => undefined }));',
  '',
].join('\n');

const buildRaw = async (root) => (await import(realVite)).build(serverViteConfig(root, SERVER_CONFIG));

const SERVER_CONFIG = { targets: ['server'], build: { aliases: { '@shared': 'shared' }, define: { __BUILD__: 'b42' } } };

const serverApp = (files = {}) => fixtureApp(SERVER_CONFIG, {
  'server/main.ts': SERVER_MAIN,
  'shared/greeting.ts': "export const greeting = 'hello';\n",
  'src/label.ts': "export const label = 'from-src';\n",
  ...files,
});

export { SERVER_CONFIG, buildRaw, cleanup, fixtureApp, put, realVite, serverApp, tempDir };
