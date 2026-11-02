/* @layer tooling-scripts @kind test */
import { mkdirSync, readFileSync, realpathSync, symlinkSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { listEntries } from '../src/store/list-entries.mjs';
import { storeRelativeOf } from '../src/vite-deps/store-paths.mjs';
import { restoreViteDeps, storeViteDeps } from '../src/vite-deps/vite-deps-cache.mjs';
import { cacheTestTree } from './cache-test-tree.mjs';

const { tempDir, put, cleanup } = cacheTestTree('build-cache-vite-deps-link-');

afterEach(cleanup);

const HASHES = { lockfileHash: 'aaaaaaaa', configHash: 'bbbbbbbb', hash: 'cccccccc' };
const PICKER = 'picker@1.0.0/node_modules/picker/index.js';
const STYLE = 'picker@1.0.0/node_modules/picker/style.css';

const linkedInstall = (withDeps) => {
  const installRoot = tempDir();
  const packages = join(tempDir(), 'entry/node_modules/.pnpm');
  put(packages, { [PICKER]: 'export default 1;' });
  mkdirSync(join(installRoot, 'node_modules'), { recursive: true });
  symlinkSync(packages, join(installRoot, 'node_modules/.pnpm'), process.platform === 'win32' ? 'junction' : 'dir');
  const depsDir = join(installRoot, 'node_modules/.vite/deps');
  if (withDeps) {
    const src = relative(depsDir, join(packages, PICKER)).split(sep).join('/');
    put(depsDir, { '_metadata.json': JSON.stringify({ ...HASHES, browserHash: 'b1', optimized: { picker: { src, file: 'picker.js', fileHash: 'f1', needsInterop: false } }, chunks: {} }), 'picker.js': 'one', 'package.json': '{"type":"module"}' });
  }
  return { installRoot, packages, depsDir };
};

describe('K1 a package store reached through a link', { tags: ['critical'] }, () => {
  it('names a path below it whether it is given by the link or by where the link points', () => {
    const { installRoot, packages } = linkedInstall(false);
    const inStore = storeRelativeOf(installRoot);
    expect(inStore(join(packages, PICKER))).toBe(PICKER);
    expect(inStore(join(installRoot, 'node_modules/.pnpm', PICKER))).toBe(PICKER);
    expect(inStore(join(installRoot, 'node_modules/other.js'))).toBeNull();
  });

  it('stores sources under the store as portable ones and restores them into an install on another store', async () => {
    const root = tempDir();
    const made = linkedInstall(true);
    expect(await storeViteDeps({ ...made, root, version: '7.3.7', buildKey: 'linux-x64-abc', hashes: HASHES })).toBe('stored');
    const [{ dir }] = listEntries(root).filter(({ manifest }) => manifest?.kind === 'vite-deps');
    expect(JSON.parse(readFileSync(join(dir, 'files', '_metadata.json'), 'utf8')).optimized.picker.src).toBe(`@root/node_modules/.pnpm/${PICKER}`);

    const other = linkedInstall(false);
    expect(restoreViteDeps({ ...other, root, version: '7.3.7', buildKey: 'linux-x64-abc', hashes: HASHES })).toBe('restored');
    const restored = JSON.parse(readFileSync(join(other.depsDir, '_metadata.json'), 'utf8'));
    expect(restored.optimized.picker.src).toBe(join(other.installRoot, 'node_modules/.pnpm', PICKER));
  });

  it('stores bundle imports into the store and the install as tokens and points them at the install it restores into', async () => {
    const root = tempDir();
    const made = linkedInstall(true);
    const slashed = (path) => path.split(sep).join('/');
    const imports = ({ packages, installRoot }) => `import "${slashed(realpathSync(packages))}/${STYLE}";\nimport "${slashed(installRoot)}/src/app.css";\n`;
    put(made.depsDir, { 'picker.js': imports(made) });
    expect(await storeViteDeps({ ...made, root, version: '7.3.7', buildKey: 'linux-x64-css', hashes: HASHES })).toBe('stored');
    const [{ dir }] = listEntries(root).filter(({ manifest }) => manifest?.kind === 'vite-deps');
    expect(readFileSync(join(dir, 'files', 'picker.js'), 'utf8')).toBe(`import "@@brock-deps-store@@/${STYLE}";\nimport "@@brock-deps-root@@/src/app.css";\n`);

    const other = linkedInstall(false);
    expect(restoreViteDeps({ ...other, root, version: '7.3.7', buildKey: 'linux-x64-css', hashes: HASHES })).toBe('restored');
    expect(readFileSync(join(other.depsDir, 'picker.js'), 'utf8')).toBe(imports(other));
  });
});
