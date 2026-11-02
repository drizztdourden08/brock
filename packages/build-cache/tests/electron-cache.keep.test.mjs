/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { electronEntryId, insideSharedStore, restoreElectron, storeElectron } from '../src/electron/electron-cache.mjs';
import { entryPaths } from '../src/store/entry-path.mjs';
import { cacheTestTree } from './cache-test-tree.mjs';

const { tempDir, put, cleanup } = cacheTestTree('build-cache-electron-');

afterEach(cleanup);

const VERSION = '42.1.0';

const electronPackage = (withDist) => {
  const dir = join(tempDir(), 'node_modules', 'electron');
  put(dir, { 'package.json': JSON.stringify({ name: 'electron', version: VERSION }), 'install.js': '\n' });
  if (withDist) put(dir, { 'path.txt': 'electron.exe', 'dist/electron.exe': 'binary', 'dist/version': `v${VERSION}`, 'dist/resources/default_app.asar': 'asar' });
  return dir;
};

describe('K4 electron cache', { tags: ['critical'] }, () => {
  it('never restores into a package that sits in a shared package store', async () => {
    const root = tempDir();
    await storeElectron(electronPackage(true), { root });
    const entry = tempDir();
    put(entry, { '.brock-store.json': '{}' });
    const inStore = join(entry, 'node_modules', '.pnpm', 'electron@42.1.0', 'node_modules', 'electron');
    put(inStore, { 'package.json': JSON.stringify({ name: 'electron', version: VERSION }), 'install.js': '\n' });
    expect(insideSharedStore(inStore)).toBe(true);
    expect(restoreElectron(inStore, { root })).toBe('skipped');
    expect(existsSync(join(inStore, 'dist'))).toBe(false);
    expect(insideSharedStore(electronPackage(false))).toBe(false);
  });

  it('stores a ready binary once, then restores it into a fresh install at another path', async () => {
    const root = tempDir();
    const ready = electronPackage(true);
    expect(await storeElectron(ready, { root })).toBe('stored');
    expect(await storeElectron(ready, { root })).toBe('present');
    const fresh = electronPackage(false);
    expect(restoreElectron(fresh, { root })).toBe('restored');
    expect(readFileSync(join(fresh, 'dist', 'electron.exe'), 'utf8')).toBe('binary');
    expect(readFileSync(join(fresh, 'path.txt'), 'utf8')).toBe('electron.exe');
    expect(restoreElectron(fresh, { root })).toBe('ready');
  });

  it('refuses a cached binary whose content changed, and leaves the install for the download', async () => {
    const root = tempDir();
    await storeElectron(electronPackage(true), { root });
    const fresh = electronPackage(false);
    const { filesDir } = entryPaths(electronEntryId(root, fresh));
    writeFileSync(join(filesDir, 'dist', 'electron.exe'), 'tampered');
    expect(restoreElectron(fresh, { root })).toBe('missing');
    expect(existsSync(join(fresh, 'dist'))).toBe(false);
    expect(existsSync(filesDir)).toBe(false);
  });

});
