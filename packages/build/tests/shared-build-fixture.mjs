/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { vi } from 'vitest';
import { reuseLogger, useDevelopmentMode } from './reuse-test-files.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-shared-build-');

const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'core.autocrlf=false', ...args], { cwd, stdio: 'pipe' });

const APP_FILES = {
  'package.json': '{"name":"@scope/app","version":"1.2.3","type":"module"}',
  'electron/main.js': "import { greet } from './greet.js';\nconsole.log(greet());\n",
  'electron/greet.js': "export const greet = () => 'hello one';\n",
  '.gitignore': 'node_modules/\ndist/\n',
};

const repo = () => {
  const root = tempDir();
  for (const [path, content] of Object.entries(APP_FILES)) put(root, path, content);
  git(root, 'init', '-q');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'first');
  return root;
};

const cloneOf = (root) => {
  const copy = tempDir();
  git(copy, 'clone', '-q', root, '.');
  return copy;
};

const useSharedCache = () => {
  useDevelopmentMode(() => {
    vi.unstubAllEnvs();
    cleanup();
  });
  return () => {
    const cache = tempDir();
    vi.stubEnv('BROCK_BUILD_CACHE_DIR', cache);
    return cache;
  };
};

const lines = () => {
  const found = [];
  return { found, log: (line) => found.push(line) };
};

const outFile = (root) => join(root, 'dist/electron/main.js');

export { cloneOf, git, lines, outFile, put, repo, reuseLogger, tempDir, useSharedCache };
