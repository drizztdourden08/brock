/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { createDataDomains } from '../src/main/storage/create-data-domains';
import { createListGate } from '../src/main/documents/list-gate';
import { createDocumentAccess } from '../src/main/documents/document-access';
import { knownProfiles, makeTree, sessionOf } from './folder-fixture';

vi.mock('electron', () => ({ dialog: {}, app: { addRecentDocument: () => undefined, clearRecentDocuments: () => undefined } }));

let base = '';
let granted = '';

const domain = (dir: string) => createDataDomains([{ domain: 'x', label: 'X', dir }], (rel) => join(base, 'Data', rel));

beforeEach(async () => {
  ({ base, granted } = await makeTree('brock-domains-'));
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('the folder of a data domain', () => {
  it('cannot be Data itself or above it, however it is spelled', () => {
    for (const dir of ['', ' ', '.', './', 'x/..', 'x/../', 'a/b/../..', './/.', '..', '../up', 'a/../..']) {
      expect(() => domain(dir), JSON.stringify(dir)).toThrow();
    }
  });

  it('can be a folder or a path below Data', () => {
    for (const dir of ['x', 'media/art', './media', 'a/../media']) expect(() => domain(dir)).not.toThrow();
  });
});

describe('the recent signing key', () => {
  it('lives in the user data keys folder, not in the Data tree', async () => {
    const access = createDocumentAccess();
    const paths = { userData: (...segments: string[]) => join(base, ...segments), data: (...segments: string[]) => join(base, 'Data', ...segments) };
    const call = sessionOf({ documents: access, paths, profiles: knownProfiles, log: vi.fn() });
    access.allow(join(granted, 'sub', 'in.txt'));
    await call('document:writeText', join(granted, 'sub', 'in.txt'), 'x', 'p1');
    expect(existsSync(join(base, 'keys', 'recent-signing.key'))).toBe(true);
    expect(existsSync(join(base, 'Data', 'recent-signing.key'))).toBe(false);
  });
});

describe('one listing at a time', () => {
  it('runs the work in turn, queues a few and refuses the rest as busy', async () => {
    const run = createListGate(2);
    const order: string[] = [];
    const releases: (() => void)[] = [];
    const job = (name: string) => run(async () => {
      order.push(`start ${name}`);
      await new Promise<void>((release) => releases.push(release));
      order.push(`end ${name}`);
      return name;
    });
    const results = [job('a'), job('b'), job('c')];
    await expect(job('d')).rejects.toThrow(/Too many folder listings/);
    expect(order).toEqual(['start a']);
    for (let turn = 0; turn < 3; turn += 1) {
      await new Promise<void>((resume) => setImmediate(resume));
      releases.shift()?.();
    }
    expect(await Promise.all(results)).toEqual(['a', 'b', 'c']);
    expect(order).toEqual(['start a', 'end a', 'start b', 'end b', 'start c', 'end c']);
    expect(await run(() => Promise.resolve('again'))).toBe('again');
  });

  it('keeps folder listings of one app in turn, and says busy past the queue', async () => {
    const access = createDocumentAccess({ limits: { waiting: 1 } });
    access.allowFolder(granted);
    const settled = await Promise.allSettled([access.list(granted), access.list(granted), access.list(granted)]);
    expect(settled.map((outcome) => outcome.status)).toEqual(['fulfilled', 'fulfilled', 'rejected']);
    expect((settled[2] as PromiseRejectedResult).reason).toMatchObject({ message: expect.stringMatching(/Too many folder listings/) as string });
    expect((await access.list(granted)).entries.length).toBeGreaterThan(0);
  });
});
