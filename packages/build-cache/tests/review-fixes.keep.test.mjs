/* @layer tooling-scripts @kind test */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { electronEntryId, restoreElectron, storeElectron } from '../src/electron/electron-cache.mjs';
import { electronTarget } from '../src/electron/electron-target.mjs';
import { withRestoreLock } from '../src/electron/restore-lock.mjs';
import { announceJob, beginJob, jobState, readJob, waitForJob } from '../src/jobs/background-job.mjs';
import { packageBuildKey } from '../src/packages/compile-package.mjs';
import { packageClosure } from '../src/packages/package-closure.mjs';
import { servePackage } from '../src/packages/serve-package.mjs';
import { entryPaths } from '../src/store/entry-path.mjs';
import { listEntries } from '../src/store/list-entries.mjs';
import { cacheTestTree, sourcePackage } from './cache-test-tree.mjs';

const { tempDir, put, cleanup } = cacheTestTree('build-cache-review-');

afterEach(cleanup);

const NAME = '@drizztdourden08/demo';

const electronPackage = (withDist, version = '42.1.0') => {
  const dir = join(tempDir(), 'node_modules', 'electron');
  put(dir, { 'package.json': JSON.stringify({ name: 'electron', version }) });
  if (withDist) put(dir, { 'path.txt': 'electron.exe', 'dist/electron.exe': 'binary', 'dist/version': `v${version}` });
  return dir;
};

describe('E2 package build key', { tags: ['e2e'] }, () => {
  it('keeps a patched and an unpatched copy of one version side by side', async () => {
    const root = tempDir();
    const serve = async (files) => {
      const app = tempDir();
      put(app, { 'package.json': JSON.stringify({ name: 'app', dependencies: { [NAME]: '1.2.3' } }) });
      put(join(app, 'node_modules', '@drizztdourden08', 'demo'), files);
      const source = packageClosure(app, { scope: '@drizztdourden08/' }).get(NAME);
      return servePackage({ root, rootDir: app, source, ...packageBuildKey({ platform: 'node', target: 'node22' }) });
    };
    const plain = sourcePackage(NAME);
    const patched = sourcePackage(NAME, { 'src/sub.ts': "export { state } from './state';\nexport const patched = true;\n" });
    expect((await serve(plain)).built).toBe(true);
    expect((await serve(patched)).built).toBe(true);
    expect((await serve(plain)).built).toBe(false);
    expect((await serve(patched)).built).toBe(false);
    expect(listEntries(root)).toHaveLength(2);
  });
});

describe('K3 electron store', () => {
  it('replaces a damaged entry instead of counting it as present', { tags: ['critical'] }, async () => {
    const root = tempDir();
    const ready = electronPackage(true);
    await storeElectron(ready, { root });
    const { filesDir } = entryPaths(electronEntryId(root, ready));
    writeFileSync(join(filesDir, 'dist', 'electron.exe'), 'half');
    expect(await storeElectron(ready, { root })).toBe('stored');
    expect(restoreElectron(electronPackage(false), { root })).toBe('restored');
  });

  it('keys the binary by the target arch from the environment or .npmrc', { tags: ['critical'] }, () => {
    const dir = electronPackage(false);
    expect(electronTarget(dir, { npm_config_arch: 'arm64' }).arch).toBe('arm64');
    put(join(dir, '..', '..'), { '.npmrc': 'arch=ia32\n' });
    expect(electronTarget(dir, {}).arch).toBe('ia32');
    expect(electronEntryId('/c', dir, {})?.buildKey).toMatch(/-ia32$/);
  });
});

describe('K1 restore lock', { tags: ['critical'] }, () => {
  it('takes over a stale lock and frees the lock after an error', () => {
    const dir = electronPackage(false);
    const later = () => Date.now() + 11 * 60 * 1000;
    const order = [];
    const inner = () => order.push('inner');
    const outer = () => {
      order.push('outer');
      withRestoreLock(dir, inner, later);
    };
    const boom = () => {
      throw new Error('boom');
    };
    withRestoreLock(dir, outer);
    expect(() => withRestoreLock(dir, boom)).toThrow('boom');
    expect(withRestoreLock(dir, () => 'free')).toBe('free');
    expect(order).toEqual(['outer', 'inner']);
  });
});

describe('K1 background job', { tags: ['critical'] }, () => {
  it('records a failure with its reason', async () => {
    const file = join(tempDir(), 'job.json');
    beginJob(file)({ failed: 'sync failed' });
    expect(readJob(file)).toMatchObject({ state: 'failed', reason: 'sync failed' });
    expect(await waitForJob(file, 'x', () => {})).toBe(false);
  });

  it('does not wait on a job whose heartbeat stopped, such as a dead or reused pid', () => {
    const file = join(tempDir(), 'job.json');
    announceJob(file, { pid: process.pid, now: () => 1000 });
    expect(jobState(file, () => 1000 + 10_000).running).toBe(true);
    expect(jobState(file, () => 1000 + 31_000).running).toBe(false);
    expect(JSON.parse(readFileSync(file, 'utf8')).pid).toBe(process.pid);
  });
});
