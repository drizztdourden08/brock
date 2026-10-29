/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { viteHashes } from '../src/shared-deps-cache/vite-hash.mjs';

/**
 * @param {{ tempDir: () => string, put: (root: string, path: string, content?: string) => void }} tree
 * @returns {Record<string, any>} the lockfile, metadata, config and app builders
 */
const depsFixture = ({ tempDir, put }) => {
  const LOCKFILE = 'lockfileVersion: 9\npackages:\n  picker@1.0.0: {}\n';

  const metadataFor = (hashes, extra = {}) => JSON.stringify({
    ...hashes,
    browserHash: 'b1',
    optimized: { picker: { src: '../../.pnpm/picker@1.0.0/node_modules/picker/index.js', file: 'picker.js', fileHash: 'f1', needsInterop: false } },
    chunks: {},
    ...extra,
  });

  const makeConfig = (root, overrides = {}) => ({
    command: 'serve',
    mode: 'development',
    root: join(root, 'src'),
    cacheDir: join(root, 'node_modules/.vite'),
    keepProcessEnv: false,
    assetsInclude: () => false,
    plugins: [{ name: 'vite:react' }, { name: 'brock:optimize-deps' }],
    resolve: { alias: [{ find: '@app', replacement: join(root, 'src') }], dedupe: ['react'] },
    optimizeDeps: { include: ['react', 'picker'] },
    ...overrides,
  });

  const app = ({ version = '1.0.0', lockfile = LOCKFILE, withCache = true } = {}) => {
    const root = tempDir();
    put(root, 'package.json', '{"name":"app"}');
    put(root, 'src/index.html', '');
    put(root, 'node_modules/vite/package.json', '{"name":"vite","version":"7.3.7"}');
    put(root, 'node_modules/.pnpm/lock.yaml', lockfile);
    put(root, `node_modules/.pnpm/picker@${version}/node_modules/picker/package.json`, JSON.stringify({ name: 'picker', version }));
    put(root, `node_modules/.pnpm/picker@${version}/node_modules/picker/index.js`, 'export default 1;');
    const config = makeConfig(root);
    if (withCache) {
      const hashes = viteHashes(config, { content: lockfile });
      put(root, 'node_modules/.vite/deps/_metadata.json', metadataFor(hashes));
      put(root, 'node_modules/.vite/deps/picker.js', 'export default 1;');
      put(root, 'node_modules/.vite/deps/package.json', '{"type":"module"}');
    }
    return { root, config };
  };

  const metadataOf = (root) => JSON.parse(readFileSync(join(root, 'node_modules/.vite/deps/_metadata.json'), 'utf8'));
  return { LOCKFILE, metadataFor, makeConfig, app, metadataOf };
};

export { depsFixture };
