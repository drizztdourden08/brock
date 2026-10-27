/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildReusePlugin } from '../src/build-reuse/build-reuse-plugin.mjs';
import { age, HOUR } from './reuse-test-files.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-reuse-plugin-');

beforeEach(() => {
  process.env.NODE_ENV_ELECTRON_VITE = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV_ELECTRON_VITE;
  cleanup();
});

const messages = [];
const customLogger = { info: (message) => messages.push(message), warn: () => undefined, warnOnce: () => undefined, error: () => undefined, clearScreen: () => undefined, hasErrorLogged: () => false, hasWarned: false };

const project = () => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app","type":"module"}');
  put(root, 'electron/main.js', "import { greet } from './greet.js';\nconsole.log(greet());\n");
  put(root, 'electron/greet.js', "export const greet = () => 'hello one';\n");
  age(root, 'package.json');
  age(root, 'electron/main.js');
  age(root, 'electron/greet.js');
  return root;
};

const run = (root, extra = {}) => build({
  root,
  configFile: false,
  logLevel: 'info',
  customLogger,
  envPrefix: 'MAIN_VITE_',
  plugins: [buildReusePlugin({ rootDir: root, target: 'main' })],
  build: { outDir: join(root, 'dist/electron'), emptyOutDir: true, minify: false, lib: { entry: { main: join(root, 'electron/main.js') }, formats: ['es'] }, ...extra.build },
  ...extra.top,
});

const reused = () => messages.some((message) => message.includes('reused the main bundle'));

const written = (root) => readFileSync(join(root, 'dist/electron/main.js'), 'utf8');

describe('buildReusePlugin', () => {
  it('writes the last bundle again, without reading source, while no input changed', async () => {
    const root = project();
    await run(root);
    expect(written(root)).toContain('hello one');
    const first = written(root);
    expect(existsSync(join(root, 'node_modules/.vite/brock-build-reuse/main.json'))).toBe(true);
    rmSync(join(root, 'dist'), { recursive: true, force: true });
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(true);
    expect(written(root)).toBe(first);
  });

  it('builds again when a module file changes, and reuses that new bundle after', async () => {
    const root = project();
    await run(root);
    put(root, 'electron/greet.js', "export const greet = () => 'hello two';\n");
    age(root, 'electron/greet.js', 5 * HOUR);
    messages.length = 0;
    await run(root);
    expect(messages.some((message) => message.includes('reused'))).toBe(false);
    expect(written(root)).toContain('hello two');
    await run(root);
    expect(messages.some((message) => message.includes('reused the main bundle'))).toBe(true);
    expect(written(root)).toContain('hello two');
  });

  it('builds again when the config key changes', async () => {
    const root = project();
    await run(root);
    put(root, 'brock.config.ts', 'export default { define: { A: 1 } };');
    age(root, 'brock.config.ts');
    messages.length = 0;
    await run(root);
    expect(messages.some((message) => message.includes('reused'))).toBe(false);
  });

  it('never reuses outside a dev start', async () => {
    const root = project();
    process.env.NODE_ENV_ELECTRON_VITE = 'production';
    await run(root);
    expect(existsSync(join(root, 'node_modules/.vite/brock-build-reuse/main.json'))).toBe(false);
  });

  it('builds again when an import.meta.env value changes, and reuses when it is the same', async () => {
    const root = project();
    put(root, 'electron/main.js', 'console.log(import.meta.env.MAIN_VITE_API);\n');
    age(root, 'electron/main.js');
    process.env.MAIN_VITE_API = 'prod';
    await run(root);
    expect(written(root)).toContain('prod');
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(true);
    process.env.MAIN_VITE_API = 'dev';
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
    expect(written(root)).toContain('dev');
    delete process.env.MAIN_VITE_API;
  });
});

describe('buildReusePlugin env, mode and options', () => {
  it('builds again for another mode, and when the env file of the mode changes', async () => {
    const root = project();
    put(root, 'electron/main.js', 'console.log(import.meta.env.MAIN_VITE_API);\n');
    put(root, '.env.staging', 'MAIN_VITE_API=staging-one\n');
    age(root, 'electron/main.js');
    age(root, '.env.staging');
    await run(root, { top: { mode: 'staging', envDir: root } });
    expect(written(root)).toContain('staging-one');
    messages.length = 0;
    await run(root, { top: { mode: 'staging', envDir: root } });
    expect(reused()).toBe(true);
    messages.length = 0;
    await run(root, { top: { mode: 'development', envDir: root } });
    expect(reused()).toBe(false);
    put(root, '.env.staging', 'MAIN_VITE_API=staging-two\n');
    age(root, '.env.staging', 5 * HOUR);
    messages.length = 0;
    await run(root, { top: { mode: 'staging', envDir: root } });
    expect(reused()).toBe(false);
    expect(written(root)).toContain('staging-two');
  });

  it('builds again for other build options', async () => {
    const root = project();
    await run(root);
    messages.length = 0;
    await run(root, { build: { minify: true } });
    expect(reused()).toBe(false);
  });

  it('builds again when a new file shadows an import', async () => {
    const root = project();
    put(root, 'electron/main.js', "import { greet } from './greet';\nconsole.log(greet());\n");
    age(root, 'electron/main.js');
    await run(root);
    expect(written(root)).toContain('hello one');
    put(root, 'electron/greet.mjs', "export const greet = () => 'shadow';\n");
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
    expect(written(root)).toContain('shadow');
  });
});

describe('buildReusePlugin resolution', () => {
  it('builds again when the package.json of a bundled dependency changes its entry', async () => {
    const root = project();
    put(root, 'node_modules/dep/package.json', '{"name":"dep","version":"1.0.0","main":"one.js"}');
    put(root, 'node_modules/dep/one.js', "module.exports = 'dep one';\n");
    put(root, 'node_modules/dep/two.js', "module.exports = 'dep two';\n");
    put(root, 'electron/main.js', "import dep from 'dep';\nconsole.log(dep);\n");
    ['node_modules/dep/package.json', 'node_modules/dep/one.js', 'node_modules/dep/two.js', 'electron/main.js'].forEach((path) => age(root, path));
    await run(root);
    expect(written(root)).toContain('dep one');
    put(root, 'node_modules/dep/package.json', '{"name":"dep","version":"1.0.1","main":"two.js"}');
    age(root, 'node_modules/dep/package.json', 5 * HOUR);
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
    expect(written(root)).toContain('dep two');
  });

  it('builds again when a file the config imports changes', async () => {
    const root = project();
    put(root, 'brock.config.ts', "import { names } from './config-helper';\nexport default names;\n");
    put(root, 'config-helper.ts', 'export const names = 1;\n');
    age(root, 'brock.config.ts');
    age(root, 'config-helper.ts');
    await run(root);
    put(root, 'config-helper.ts', 'export const names = 22;\n');
    age(root, 'config-helper.ts', 5 * HOUR);
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
  });
});
