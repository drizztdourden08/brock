/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'vite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildReusePlugin } from '../src/build-reuse/build-reuse-plugin.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-reuse-portable-');

beforeEach(() => {
  process.env.NODE_ENV_ELECTRON_VITE = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV_ELECTRON_VITE;
  cleanup();
});

const messages = [];
const customLogger = { info: (message) => messages.push(message), warn: () => undefined, warnOnce: () => undefined, error: () => undefined, clearScreen: () => undefined, hasErrorLogged: () => false, hasWarned: false };

const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'core.autocrlf=false', ...args], { cwd, stdio: 'pipe' });

const repo = () => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app","type":"module"}');
  put(root, 'electron/main.js', "import { greet } from './greet.js';\nconsole.log(greet());\n");
  put(root, 'electron/greet.js', "export const greet = () => 'hello one';\n");
  put(root, '.gitignore', 'node_modules/\ndist/\n');
  git(root, 'init', '-q');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'first');
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

const reused = () => messages.some((message) => message.includes('reused the main bundle'));

const RECORD = 'node_modules/.vite/brock-build-reuse';

const cloneWithRecord = (root) => {
  const copy = tempDir();
  git(copy, 'clone', '-q', root, '.');
  cpSync(join(root, RECORD), join(copy, RECORD), { recursive: true });
  return copy;
};

describe('buildReusePlugin in a git checkout', () => {
  it('reuses the bundle in another checkout of the same commit, with fresh file times and another path', async () => {
    const root = repo();
    await run(root);
    const copy = cloneWithRecord(root);
    messages.length = 0;
    await run(copy);
    expect(reused()).toBe(true);
    expect(readFileSync(join(copy, 'dist/electron/main.js'), 'utf8')).toContain('hello one');
  });

  it('builds again in the other checkout when a source file there differs', async () => {
    const root = repo();
    await run(root);
    const copy = cloneWithRecord(root);
    put(copy, 'electron/greet.js', "export const greet = () => 'hello two';\n");
    messages.length = 0;
    await run(copy);
    expect(reused()).toBe(false);
    expect(readFileSync(join(copy, 'dist/electron/main.js'), 'utf8')).toContain('hello two');
  });

  it('builds again when a git-ignored generated module changes', async () => {
    const root = repo();
    put(root, '.gitignore', 'node_modules/\ndist/\nelectron/gen.js\n');
    put(root, 'electron/gen.js', "export const greet = () => 'generated one';\n");
    put(root, 'electron/main.js', "import { greet } from './gen.js';\nconsole.log(greet());\n");
    await run(root);
    put(root, 'electron/gen.js', "export const greet = () => 'generated two';\n");
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
    expect(readFileSync(join(root, 'dist/electron/main.js'), 'utf8')).toContain('generated two');
  });

  it('builds again when an untracked file appears beside a module and shadows its import', async () => {
    const root = repo();
    put(root, 'electron/main.js', "import { greet } from './greet';\nconsole.log(greet());\n");
    await run(root);
    put(root, 'electron/greet.mjs', "export const greet = () => 'shadow';\n");
    messages.length = 0;
    await run(root);
    expect(reused()).toBe(false);
    expect(readFileSync(join(root, 'dist/electron/main.js'), 'utf8')).toContain('shadow');
  });
});
