/* @layer electron-main @kind test */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CLEAR_CACHE_ENV, DEPS_METADATA_ENV, DEV_CACHE_KEY_FILE } from '../src/main/bootstrap/dev-cache.constants';
import { refreshDevCache } from '../src/main/bootstrap/dev-cache';
import { devCachePlan } from '../src/main/bootstrap/dev-cache-plan';

const cleared = vi.hoisted(() => ({ count: 0 }));

vi.mock('electron', () => ({ session: { defaultSession: { clearCache: () => { cleared.count += 1; return Promise.resolve(); } } } }));

const dirs: string[] = [];
const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-dev-cache-'));
  dirs.push(dir);
  return dir;
};

afterEach(() => {
  cleared.count = 0;
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const metadata = (hash: string): string => JSON.stringify({ hash, browserHash: `${hash}-b`, optimized: {} });

describe('devCachePlan', () => {
  it('keeps the cache while the optimizer hash is the one of the last dev boot', () => {
    expect(devCachePlan(metadata('aa11'), 'aa11', false)).toEqual({ clear: false, hash: 'aa11' });
  });

  it('clears it when the hash changed, or when asked to', () => {
    expect(devCachePlan(metadata('bb22'), 'aa11', false)).toEqual({ clear: true, hash: 'bb22' });
    expect(devCachePlan(metadata('bb22'), null, false)).toEqual({ clear: true, hash: 'bb22' });
    expect(devCachePlan(metadata('aa11'), 'aa11', true)).toEqual({ clear: true, hash: 'aa11' });
  });

  it('keeps it while the optimizer has no metadata yet, since new chunks get new URLs', () => {
    expect(devCachePlan(null, 'aa11', false)).toEqual({ clear: false, hash: null });
    expect(devCachePlan('{ not json', 'aa11', false)).toEqual({ clear: false, hash: null });
  });
});

describe('refreshDevCache', () => {
  it('clears once for a new hash, records it, and keeps the cache on the next boot', async () => {
    const userData = tempDir();
    const file = join(tempDir(), '_metadata.json');
    writeFileSync(file, metadata('cc33'));
    const env = { [DEPS_METADATA_ENV]: file };
    expect(await refreshDevCache(userData, env)).toBe(true);
    expect(readFileSync(join(userData, DEV_CACHE_KEY_FILE), 'utf8')).toBe('cc33');
    expect(await refreshDevCache(userData, env)).toBe(false);
    expect(await refreshDevCache(userData, { ...env, [CLEAR_CACHE_ENV]: '1' })).toBe(true);
    expect(cleared.count).toBe(2);
  });
});
