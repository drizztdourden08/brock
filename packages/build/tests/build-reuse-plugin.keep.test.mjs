/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { describe, expect, it } from 'vitest';
import { buildReusePlugin } from '../src/build-reuse/build-reuse-plugin.mjs';
import { age, HOUR, reuseLogger, useDevelopmentMode, writeMainApp } from './reuse-test-files.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-reuse-plugin-');

useDevelopmentMode(cleanup);

const { messages, customLogger } = reuseLogger();

const project = () => {
  const root = tempDir();
  writeMainApp(put, root);
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

describe('K1 buildReusePlugin', { tags: ['e2e'] }, () => {
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

describe('K1 buildReusePlugin shadowed imports', { tags: ['e2e'] }, () => {
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

