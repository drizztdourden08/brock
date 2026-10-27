/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, rmSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildReusePlugin } from '../src/build-reuse/build-reuse-plugin.mjs';
import { moduleStamps } from '../src/build-reuse/module-stamps.mjs';
import { reuseKey } from '../src/build-reuse/reuse-key.mjs';
import { storeIsCurrent } from '../src/build-reuse/reuse-store.mjs';
import { stubInput } from '../src/build-reuse/stub-input.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-reuse-');

const HOUR = 3_600_000;

const age = (root, path, ms = 2 * HOUR) => {
  const when = new Date(Date.now() - ms);
  utimesSync(join(root, path), when, when);
};

beforeEach(() => {
  process.env.NODE_ENV_ELECTRON_VITE = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV_ELECTRON_VITE;
  cleanup();
});

describe('storeIsCurrent', () => {
  const stamps = { '/a.ts': '10:5', '/b.ts': '20:7' };
  const store = { version: 1, key: 'k', files: stamps, outputs: [{ fileName: 'main.js', base64: '' }] };
  const stampFrom = (table) => (file) => table[file] ?? null;

  it('accepts a bundle whose key and every module file stamp are unchanged', () => {
    expect(storeIsCurrent(store, 'k', stampFrom(stamps))).toBe(true);
  });

  it('rejects a changed key, a changed file, a removed file and a file touched during the build', () => {
    expect(storeIsCurrent(store, 'other', stampFrom(stamps))).toBe(false);
    expect(storeIsCurrent(store, 'k', stampFrom({ ...stamps, '/b.ts': '21:7' }))).toBe(false);
    expect(storeIsCurrent(store, 'k', stampFrom({ '/a.ts': '10:5' }))).toBe(false);
    expect(storeIsCurrent({ ...store, files: { ...stamps, '/c.ts': null } }, 'k', stampFrom({ ...stamps, '/c.ts': '1:1' }))).toBe(false);
  });

  it('rejects a missing store, another format and a store with no files or no outputs', () => {
    expect(storeIsCurrent(null, 'k', stampFrom(stamps))).toBe(false);
    expect(storeIsCurrent({ ...store, version: 0 }, 'k', stampFrom(stamps))).toBe(false);
    expect(storeIsCurrent({ ...store, files: {} }, 'k', stampFrom({}))).toBe(false);
    expect(storeIsCurrent({ ...store, outputs: [] }, 'k', stampFrom(stamps))).toBe(false);
  });
});

describe('moduleStamps', () => {
  const table = { '/src/old.ts': '1000:5', '/src/new.ts': '99950:5' };
  const stamp = (file) => table[file] ?? null;

  it('keeps real files, drops virtual and relative ids, and strips queries', () => {
    const stamps = moduleStamps(['/src/old.ts?raw', '\0vite/preload-helper', 'relative/file.ts', '/src/gone.ts'], 100_000, stamp);
    expect(stamps).toEqual({ '/src/old.ts': '1000:5' });
  });

  it('marks a file touched while the build ran, so the next start builds again', () => {
    expect(moduleStamps(['/src/new.ts'], 100_000, stamp)).toEqual({ '/src/new.ts': null });
  });
});

describe('stubInput', () => {
  it('keeps the entry names and points each at an empty virtual module', () => {
    expect(stubInput({ main: '/app/electron/main.ts', 'splash-preload': '/x/splash.ts' })).toEqual({ main: '\0brock-reuse:main', 'splash-preload': '\0brock-reuse:splash-preload' });
    expect(stubInput('/app/electron/main.ts')).toEqual({ main: '\0brock-reuse:main' });
    expect(stubInput(['/a/one.ts', '/a/two.mjs'])).toEqual({ one: '\0brock-reuse:one', two: '\0brock-reuse:two' });
    expect(stubInput(undefined)).toEqual({});
  });
});

describe('reuseKey', () => {
  it('is steady until the config, the manifest or the install state changes', () => {
    const root = tempDir();
    put(root, 'package.json', '{"name":"app"}');
    put(root, 'brock.config.ts', 'export default {};');
    age(root, 'package.json');
    age(root, 'brock.config.ts');
    const before = reuseKey(root, 'main');
    expect(reuseKey(root, 'main')).toBe(before);
    expect(reuseKey(root, 'preload')).not.toBe(before);
    put(root, 'brock.config.ts', 'export default { changed: true };');
    expect(reuseKey(root, 'main')).not.toBe(before);
  });

  it('changes when the lockfile appears', () => {
    const root = tempDir();
    put(root, 'package.json', '{"name":"app"}');
    const before = reuseKey(root, 'main');
    put(root, 'pnpm-lock.yaml', 'lockfileVersion: 9\n');
    expect(reuseKey(root, 'main')).not.toBe(before);
  });
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

const run = (root) => build({
  root,
  configFile: false,
  logLevel: 'info',
  customLogger,
  plugins: [buildReusePlugin({ rootDir: root, target: 'main' })],
  build: { outDir: join(root, 'dist/electron'), emptyOutDir: true, minify: false, lib: { entry: { main: join(root, 'electron/main.js') }, formats: ['es'] } },
});

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
    expect(messages.some((message) => message.includes('reused the main bundle'))).toBe(true);
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
});
