/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, readdir } from 'fs/promises';
import { join } from 'path';
import { dropTree, grantedWorld, refusedBy } from './folder-fixture';
import type { Call, Granted } from './folder-fixture';

vi.mock('electron', async () => (await import('./folder-fixture')).electronFolderMock);

let base = '';
let granted = '';
let outside = '';
let access: Granted['access'];
let call: Call;

beforeEach(async () => {
  ({ base, granted, outside, access, call } = await grantedWorld('brock-can-write-'));
});

afterEach(async () => {
  await dropTree(base);
});

const listing = async (): Promise<string[]> => (await readdir(granted, { recursive: true })).sort();

describe('K4 the dry run of a folder write check', { tags: ['critical'] }, () => {
  it('answers ok with the real folder for a granted folder and writes nothing', async () => {
    const before = await listing();
    expect(await call('document:canWrite', granted)).toEqual({ ok: true, path: granted });
    expect(await call('document:canWrite', join(granted, 'sub'))).toEqual({ ok: true, path: join(granted, 'sub') });
    expect(await listing()).toEqual(before);
  });

  it('refuses a repository folder with the reason of the write class', async () => {
    await mkdir(join(granted, 'proj', '.git'), { recursive: true });
    const answer = await call('document:canWrite', join(granted, 'proj', '.git'));
    expect(answer).toMatchObject({ ok: false, reason: expect.stringMatching(/may not be changed/) as string });
    expect(await call('document:canWrite', join(granted, 'proj'))).toMatchObject({ ok: true });
  });

  it('refuses a folder outside every grant and makes no grant', async () => {
    expect(await call('document:canWrite', outside)).toMatchObject({ ok: false, reason: expect.stringMatching(/granted folder/) as string });
    await refusedBy(access)(join(outside, 'secret.txt'));
  });

  it('refuses a file, a missing folder and a path that is not absolute', async () => {
    expect(await call('document:canWrite', join(granted, 'sub', 'in.txt'))).toMatchObject({ ok: false, reason: expect.stringMatching(/not a folder/) as string });
    expect(await call('document:canWrite', join(granted, 'missing'))).toMatchObject({ ok: false });
    expect(await call('document:canWrite', 'relative')).toMatchObject({ ok: false, reason: expect.stringMatching(/absolute/) as string });
  });
});
