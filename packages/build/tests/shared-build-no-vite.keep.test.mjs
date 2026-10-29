/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { repoSnapshot } from '../src/build-reuse/repo-snapshot.mjs';
import { moduleKeys } from '../src/build-reuse/module-keys.mjs';
import { identityOf, sharedEnvKey } from '../src/build-reuse/shared-build/env-key.mjs';
import { cloneOf, lines, outFile, repo, useSharedCache } from './shared-build-fixture.mjs';

const loaded = vi.hoisted(() => ({ names: [] }));

vi.mock('vite', () => {
  loaded.names.push('vite');
  return {};
});

vi.mock('electron-vite', () => {
  loaded.names.push('electron-vite');
  return {};
});

const freshCache = useSharedCache();

const recordFor = (root, code) => {
  const snapshot = repoSnapshot(root);
  const keys = moduleKeys([join(root, 'electron/main.js'), join(root, 'electron/greet.js')], Date.now(), { snapshot });
  const preflight = sharedEnvKey(root, 'main', identityOf(root, snapshot));
  return { key: 'k', ...keys, outputs: [{ fileName: 'main.js', base64: Buffer.from(code).toString('base64') }], preflight };
};

const store = async (root, code) => {
  const { publishBuild } = await import('../src/build-reuse/shared-build/store-shared-build.mjs');
  return publishBuild({ rootDir: root, target: 'main', record: recordFor(root, code), outDir: join(root, 'dist/electron'), snapshot: repoSnapshot(root) });
};

const restore = async (root) => {
  const { restoreSharedBuild } = await import('../src/build-reuse/shared-build/restore-shared-build.mjs');
  const { found, log } = lines();
  return { ...restoreSharedBuild(root, { log, targets: ['main'] }), found };
};

describe('a shared build hit', () => {
  it('decides from git and the cache without loading vite or electron-vite', async () => {
    freshCache();
    const root = repo();
    expect(await store(root, 'console.log("one");')).toBe('stored');
    const result = await restore(cloneOf(root));
    expect(result.hit).toBe(true);
    expect(loaded.names).toEqual([]);
  });

  it('stores the paths of the worktree as tokens and writes the paths of the restoring one', async () => {
    freshCache();
    const root = repo();
    const code = `import("${pathToFileURL(join(root, 'node_modules/x.js')).href}");\nconst a = "${root.split('\\').join('/')}/y";\n`;
    expect(await store(root, code)).toBe('stored');
    const copy = cloneOf(root);
    expect((await restore(copy)).hit).toBe(true);
    const text = readFileSync(outFile(copy), 'utf8');
    expect(text).toContain(pathToFileURL(join(copy, 'node_modules/x.js')).href);
    expect(text).toContain(`${copy.split('\\').join('/')}/y`);
    expect(text).not.toContain(root.split('\\').join('/'));
  });

  it('is not stored when a path of the worktree is left in a form it cannot move', async () => {
    freshCache();
    const root = repo();
    const doubled = `const a = "${root.split('\\').join('\\\\')}";\n`;
    expect(await store(root, process.platform === 'win32' ? doubled : `${root.toUpperCase()}`)).toBe('skipped');
  });
});
