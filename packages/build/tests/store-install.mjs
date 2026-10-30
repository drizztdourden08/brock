/* @layer tooling-scripts @kind test */
import { mkdirSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import * as vite from 'vite';

const LOCKFILE = 'lockfileVersion: 9\npackages:\n  dummy-dep@1.0.0: {}\n';
const PACKAGE = 'dummy-dep@1.0.0/node_modules/dummy-dep';
const LINK = process.platform === 'win32' ? 'junction' : 'dir';

/**
 * @param {{ tempDir: () => string, put: (root: string, path: string, content?: string) => void }} tree the temp tree helpers
 * @param {{ depth?: number }} [options] depth: how many folders deeper the shared store entry sits
 * @returns {{ root: string, packages: string }} an install linked into a store
 */
const storeInstall = ({ tempDir, put }, { depth = 0 } = {}) => {
  const entry = join(tempDir(), ...Array.from({ length: depth }, (_, index) => `level-${index}`), 'entry');
  const packages = join(entry, 'node_modules/.pnpm');
  put(packages, 'lock.yaml', LOCKFILE);
  put(packages, `${PACKAGE}/package.json`, '{"name":"dummy-dep","version":"1.0.0","type":"module","main":"index.js"}');
  put(packages, `${PACKAGE}/index.js`, 'export const answer = 42;\n');
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, 'src/index.html', '');
  put(root, 'node_modules/.modules.yaml', `virtualStoreDir: ${packages}\n`);
  mkdirSync(join(root, 'node_modules'), { recursive: true });
  symlinkSync(packages, join(root, 'node_modules/.pnpm'), LINK);
  symlinkSync(join(packages, PACKAGE), join(root, 'node_modules/dummy-dep'), LINK);
  return { root, packages };
};

/**
 * @param {string} root an install folder
 * @param {import('vite').PluginOption[]} plugins the plugins of the dev config
 * @param {string[]} [include] optimizeDeps.include
 * @returns {Promise<import('vite').ResolvedConfig>} the config Vite resolves for the renderer dev server
 */
const serveConfig = (root, plugins, include = ['dummy-dep']) => vite.resolveConfig({
  root: join(root, 'src'),
  configFile: false,
  logLevel: 'silent',
  cacheDir: join(root, 'node_modules/.vite'),
  resolve: { alias: { '@app': join(root, 'src') } },
  optimizeDeps: { include },
  plugins,
}, 'serve', 'development');

export { LOCKFILE, serveConfig, storeInstall };
