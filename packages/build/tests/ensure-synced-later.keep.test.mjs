/* @layer tooling-scripts @kind test */
import { readFileSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ensureSynced, ensureSyncedLater } from '../src/freshness/ensure-synced.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-ensure-synced-');

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

const syncedApp = () => {
  const root = tempDir();
  put(root, 'package.json', '{"name":"app"}');
  put(root, '.brock/manifest.json', '{}');
  put(root, 'tessera.config.json', JSON.stringify({ guide: { parts: '.brock/tessera-parts.ts' } }));
  const later = new Date(Date.now() + 60_000);
  utimesSync(join(root, '.brock/manifest.json'), later, later);
  return root;
};

const logged = (spy) => spy.mock.calls.map((call) => String(call[0]));

describe('K1 ensureSyncedLater', { tags: ['critical'] }, () => {
  it('returns before the cold-start guide runs, and runs it only when the guide function is called', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { problem, guide } = await ensureSyncedLater(syncedApp(), 'brock dev');
    expect(problem).toBeNull();
    expect(logged(log).some((line) => line.includes('running tessera guide'))).toBe(false);
    await guide();
    expect(logged(log)).toContain('brock dev: guide/ is missing, running tessera guide.');
  });

  it('keeps ensureSynced running the guide before it returns', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(await ensureSynced(syncedApp(), 'brock start')).toBeNull();
    expect(logged(log)).toContain('brock start: guide/ is missing, running tessera guide.');
  });
});

describe('K3 ensureSynced with sync switched off', { tags: ['critical'] }, () => {
  it('leaves a stale .brock alone, so a gate run never writes the managed files', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = syncedApp();
    const earlier = new Date(Date.now() - 60_000);
    utimesSync(join(root, '.brock/manifest.json'), earlier, earlier);
    expect(await ensureSynced(root, 'brock build', { sync: false })).toBeNull();
    expect(logged(log).some((line) => line.includes('running brock sync'))).toBe(false);
    expect(readFileSync(join(root, '.brock/manifest.json'), 'utf8')).toBe('{}');
  });
});
