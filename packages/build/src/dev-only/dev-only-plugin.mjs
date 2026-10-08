/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { devRegistryStub } from './dev-registry-stub.mjs';
import { DEV_REGISTRY, DEV_SOURCE, PRODUCTION_MODE } from './dev-only.constants.mjs';

const fileOf = (id) => id.replace(/^\0/, '').replace(/[?#].*$/, '').replace(/\\/g, '/');

const insideApp = (rootDir, file) => {
  const rel = relative(rootDir, resolve(file)).replace(/\\/g, '/');
  return rel !== '' && !rel.startsWith('..') && !rel.split('/').includes('node_modules') ? rel : null;
};

/**
 * @param {{ rootDir: string }} opts the app root
 * @returns {import('vite').Plugin} strips the .dev files from a production build
 */
const devOnlyPlugin = ({ rootDir }) => {
  let strip = false;
  return {
    name: 'brock-dev-only',
    enforce: 'pre',
    configResolved: (config) => {
      strip = config.mode === PRODUCTION_MODE;
    },
    load(id) {
      if (!strip) return null;
      const file = fileOf(id);
      const rel = insideApp(rootDir, file);
      if (!rel) return null;
      if (DEV_REGISTRY.test(rel)) return devRegistryStub(readFileSync(file, 'utf8'));
      if (DEV_SOURCE.test(rel)) this.error(`${rel} is dev-only (.dev in its name) and never ships, but the production build reached it. Only the generated .brock registries may import a dev-only file.`);
      return null;
    },
  };
};

export { devOnlyPlugin };
