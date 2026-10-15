/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { defineBrockViteConfig } from '../src/vite-config.mjs';

const { tempDir, put, cleanup } = tempTree('brock-module-path-');

afterEach(cleanup);

const realVite = pathToFileURL(createRequire(import.meta.url).resolve('vite')).href;
const configModule = pathToFileURL(join(import.meta.dirname, '../src/vite-config.mjs')).href;

const WORKER = [
  "import { parentPort, workerData } from 'node:worker_threads';",
  "import { scale } from './scale';",
  'parentPort?.postMessage(scale(workerData as number));',
  '',
].join('\n');

const MAIN = [
  "import workerPath from './job.worker?modulePath';",
  "import { Worker } from 'node:worker_threads';",
  'const worker = new Worker(workerPath, { workerData: 7 });',
  "worker.once('message', (value) => { process.stdout.write(`worker answered ${value}`); void worker.terminate(); });",
  '',
].join('\n');

const packageJson = (name, main) => JSON.stringify(main ? { name, type: 'module', main } : { name, type: 'module' });

const fixtureFiles = () => ({
  'package.json': packageJson('fixture-app'),
  'brock.config.ts': `export default ${JSON.stringify({ product: { id: 'fixture-app', name: 'Fixture', ports: { base: 41000 } } })};\n`,
  'node_modules/vite/package.json': packageJson('vite', 'index.mjs'),
  'node_modules/vite/index.mjs': `export { mergeConfig, searchForWorkspaceRoot } from '${realVite}';\n`,
  'node_modules/@vitejs/plugin-react/package.json': packageJson('@vitejs/plugin-react', 'index.mjs'),
  'node_modules/@vitejs/plugin-react/index.mjs': 'export default () => ({ name: "react-stub" });\n',
  'electron/scale.ts': 'export const scale = (n: number): number => n * 6;\n',
  'electron/job.worker.ts': WORKER,
  'electron/main.ts': MAIN,
  'electron.vite.config.mjs': `import { defineBrockViteConfig } from '${configModule}';\nexport default async () => ({ main: (await defineBrockViteConfig(import.meta.dirname)).main });\n`,
});

const fixtureApp = () => {
  const root = tempDir();
  for (const [file, text] of Object.entries(fixtureFiles())) put(root, file, text);
  return root;
};

describe('a main build with a ?modulePath worker', () => {
  it('names the main entry as a build input, not a library, so a ?modulePath bundle gets one output', async () => {
    const config = await defineBrockViteConfig(fixtureApp());
    expect(config.main.build.lib).toBeUndefined();
    expect(Object.keys(config.main.build.rollupOptions.input)).toEqual(['main']);
  });

  it('bundles the worker as its own file that the built main starts and hears from', async () => {
    const root = fixtureApp();
    const { build } = await import('electron-vite');
    await build({ root, configFile: join(root, 'electron.vite.config.mjs'), logLevel: 'silent' });
    const out = join(root, 'dist/electron');
    expect(readdirSync(out).some((file) => file.startsWith('job.worker'))).toBe(true);
    expect(execFileSync(process.execPath, [join(out, 'main.js')], { cwd: root, encoding: 'utf8', timeout: 20000 })).toBe('worker answered 42');
  }, 120000);
});
