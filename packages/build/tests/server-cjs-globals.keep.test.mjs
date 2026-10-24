/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { bundleHelperScripts } from '../src/helper-scripts/bundle-helper-scripts.mjs';
import { bundleServer } from '../src/platforms/server/bundle-server.mjs';
import { SERVER_CONFIG, cleanup, fixtureApp, serverApp } from './server-fixture.mjs';

afterEach(cleanup);

const CJS_GLOBALS_FILES = {
  'node_modules/cjs-globals/package.json': JSON.stringify({ name: 'cjs-globals', main: 'index.js' }),
  'node_modules/cjs-globals/index.js': [
    "const path = require('path');",
    'const here = path.basename(__dirname);',
    'const file = path.basename(__filename);',
    'module.exports = { here, file, resolve: typeof require.resolve, main: typeof require.main, cache: typeof require.cache };',
    '',
  ].join('\n'),
};

const OWN_GLOBALS_FILES = {
  'node_modules/own-globals/package.json': JSON.stringify({ name: 'own-globals', type: 'module', main: 'index.js' }),
  'node_modules/own-globals/index.js': [
    "import { dirname } from 'node:path';",
    "import { fileURLToPath } from 'node:url';",
    'const __dirname = dirname(fileURLToPath(import.meta.url));',
    "const __filename = 'own';",
    'export const own = [typeof __dirname, __filename];',
    '',
  ].join('\n'),
};

const SERVER_MAIN = [
  "import globals from 'cjs-globals';",
  "import { own } from 'own-globals';",
  'process.stdout.write(JSON.stringify({ ...globals, own }));',
  '',
].join('\n');

describe('the CommonJS globals of a node bundle', () => {
  it('gives an inlined CommonJS package in the server bundle a working __dirname, __filename and require, beside a module that declares its own', async () => {
    const root = serverApp({ ...CJS_GLOBALS_FILES, ...OWN_GLOBALS_FILES, 'server/main.ts': SERVER_MAIN });
    expect(await bundleServer(root, SERVER_CONFIG, 'test')).toBe(true);
    const printed = JSON.parse(execFileSync(process.execPath, [join(root, 'dist/server/main.mjs')], { encoding: 'utf8', timeout: 20000 }));
    expect(printed).toEqual({ here: 'server', file: 'main.mjs', resolve: 'function', main: 'undefined', cache: 'object', own: ['string', 'own'] });
  }, 120000);

  it('does the same in a helper bundle', async () => {
    const config = { helpers: { demo: 'src/helper.ts' } };
    const root = fixtureApp(config, {
      ...CJS_GLOBALS_FILES,
      'src/helper.ts': "import globals from 'cjs-globals';\nprocess.stdout.write(`${globals.here} ${globals.file}`);\n",
    });
    await bundleHelperScripts(root, config);
    expect(execFileSync(process.execPath, [join(root, 'dist/helpers/demo.mjs')], { encoding: 'utf8', timeout: 20000 })).toBe('helpers demo.mjs');
  }, 120000);
});
