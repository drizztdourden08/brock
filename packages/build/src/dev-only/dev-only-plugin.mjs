/* @layer tooling-scripts @kind logic */
import { readFileSync, realpathSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { devRegistryStub } from './dev-registry-stub.mjs';
import { DEV_REGISTRY, DEV_SOURCE, PRODUCTION_MODE } from './dev-only.constants.mjs';

const fileOf = (id) => id.replace(/^\0/, '').replace(/[?#].*$/, '').replace(/\\/g, '/');

const realOf = (dir) => {
  try {
    return realpathSync.native(dir);
  } catch {
    return dir;
  }
};

const rootsOf = (rootDir) => [...new Set([resolve(rootDir), realOf(resolve(rootDir))])];

const relativeTo = (root, file) => {
  const rel = relative(root, resolve(file)).replace(/\\/g, '/');
  return rel !== '' && !rel.startsWith('..') && !rel.split('/').includes('node_modules') ? rel : null;
};

const insideApp = (roots, file) => roots.map((root) => relativeTo(root, file)).find(Boolean) ?? null;

/**
 * @param {{ rootDir: string }} opts the app root
 * @returns {import('vite').Plugin} strips the .dev files from a production build
 */
const devOnlyPlugin = ({ rootDir }) => {
  let roots = [];
  return {
    name: 'brock-dev-only',
    enforce: 'pre',
    configResolved: (config) => {
      roots = config.mode === PRODUCTION_MODE ? rootsOf(rootDir) : [];
    },
    load(id) {
      if (roots.length === 0) return null;
      const file = fileOf(id);
      const rel = insideApp(roots, file);
      if (!rel) return null;
      if (DEV_REGISTRY.test(rel)) return devRegistryStub(readFileSync(file, 'utf8'));
      if (DEV_SOURCE.test(rel)) this.error(`${rel} is dev-only (.dev in its name) and never ships, but the production build reached it. Only the generated .brock registries may import a dev-only file.`);
      return null;
    },
  };
};

export { devOnlyPlugin };
