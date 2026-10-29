/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach } from 'vitest';
import { deleteTree } from '../src/worktree/delete-tree.mjs';

const LINK = process.platform === 'win32' ? 'junction' : 'dir';
const LOCKFILE = "lockfileVersion: '9.0'\n\nimporters:\n\n  .:\n    dependencies:\n      dep:\n        specifier: ^1.0.0\n        version: 1.0.0\n";

const made = [];
let storeRoot = '';

const tempFolder = (prefix) => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  made.push(dir);
  return dir;
};

const drop = async (dir) => {
  const parent = dirname(dir);
  for (const target of [join(dir, '.git'), dir]) {
    const failure = await deleteTree({ owner: parent, target, mains: [] });
    if (failure) throw new Error(`${failure.path} stayed (${failure.code})`);
  }
};

const put = (root, path, content = '') => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

const link = (root, path, target) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  symlinkSync(target, join(root, path), LINK);
};

const installedCheckout = () => {
  const source = tempFolder('brock-source-');
  const store = join(source, 'node_modules', '.pnpm');
  put(source, 'pnpm-lock.yaml', LOCKFILE);
  put(source, 'packages/pkg/package.json', '{"name":"@ws/pkg"}');
  put(source, 'node_modules/.modules.yaml', `layoutVersion: 5\nnodeLinker: isolated\nvirtualStoreDir: ${store}\n`);
  put(source, 'node_modules/.pnpm/lock.yaml', LOCKFILE);
  put(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/dep/package.json', '{"name":"dep","version":"1.0.0"}');
  put(source, 'node_modules/.pnpm/sub@1.0.0/node_modules/sub/index.js', 'module.exports = 1;');
  link(source, 'node_modules/.pnpm/dep@1.0.0/node_modules/sub', join(store, 'sub@1.0.0/node_modules/sub'));
  link(source, 'node_modules/.pnpm/node_modules/sub', join(store, 'sub@1.0.0/node_modules/sub'));
  link(source, 'node_modules/.pnpm/node_modules/@ws/pkg', join(source, 'packages/pkg'));
  link(source, 'node_modules/dep', join(store, 'dep@1.0.0/node_modules/dep'));
  link(source, 'node_modules/@ws/pkg', join(source, 'packages/pkg'));
  put(source, 'node_modules/.bin/dep.CMD', `@SET "NODE_PATH=${join(store, 'dep@1.0.0', 'node_modules')}"\n`);
  return source;
};

const freshCheckout = (lockfile = LOCKFILE) => {
  const target = tempFolder('brock-target-');
  put(target, 'pnpm-lock.yaml', lockfile);
  put(target, 'packages/pkg/package.json', '{"name":"@ws/pkg"}');
  return target;
};

const useCloneFixture = () => {
  beforeEach(() => {
    storeRoot = tempFolder('brock-store-');
    process.env.BROCK_MODULES_STORE_DIR = storeRoot;
  });
  afterEach(async () => {
    delete process.env.BROCK_MODULES_STORE_DIR;
    for (const dir of made.splice(0)) await drop(dir);
  });
  return () => storeRoot;
};

export { freshCheckout, installedCheckout, link, LOCKFILE, put, tempFolder, useCloneFixture };
