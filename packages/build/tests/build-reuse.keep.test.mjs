/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { moduleStamps } from '../src/build-reuse/module-stamps.mjs';
import { reuseKey } from '../src/build-reuse/reuse-key.mjs';
import { storeIsCurrent } from '../src/build-reuse/reuse-store.mjs';
import { stubInput } from '../src/build-reuse/stub-input.mjs';
import { age } from './reuse-test-files.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-build-reuse-');

afterEach(cleanup);

describe('storeIsCurrent', () => {
  const stamps = { '/a.ts': '10:5', '/b.ts': '20:7' };
  const store = { version: 2, key: 'k', files: stamps, dirs: { '/d': '5:5' }, outputs: [{ fileName: 'main.js', base64: '' }] };
  const stampFrom = (table) => (file) => ({ ...table, '/d': '5:5' })[file] ?? null;

  it('accepts a bundle whose key and every module file stamp are unchanged', () => {
    expect(storeIsCurrent(store, 'k', stampFrom(stamps))).toBe(true);
  });

  it('rejects a bundle whose module folder changed', () => {
    expect(storeIsCurrent({ ...store, dirs: { '/d': '4:4' } }, 'k', stampFrom(stamps))).toBe(false);
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
    const { files: stamps } = moduleStamps(['/src/old.ts?raw', '\0vite/preload-helper', 'relative/file.ts', '/src/gone.ts'], 100_000, stamp);
    expect(stamps).toEqual({ '/src/old.ts': '1000:5' });
  });

  it('marks a file touched while the build ran, so the next start builds again', () => {
    expect(moduleStamps(['/src/new.ts'], 100_000, stamp).files).toEqual({ '/src/new.ts': null });
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
