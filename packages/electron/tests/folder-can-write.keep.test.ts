/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, readdir, rm } from 'fs/promises';
import { join } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree, refusedBy, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', () => ({ dialog: {}, app: { clearRecentDocuments: () => undefined, addRecentDocument: () => undefined } }));

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;
let call: Call;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-can-write-'));
  access = testAccess();
  access.allowFolder(granted);
  call = sessionOf({ documents: access });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
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
    expect(answer).toMatchObject({ ok: false, reason: expect.stringMatching(/may not be changed/) });
    expect(await call('document:canWrite', join(granted, 'proj'))).toMatchObject({ ok: true });
  });

  it('refuses a folder outside every grant and makes no grant', async () => {
    expect(await call('document:canWrite', outside)).toMatchObject({ ok: false, reason: expect.stringMatching(/granted folder/) });
    await refusedBy(access)(join(outside, 'secret.txt'));
  });

  it('refuses a file, a missing folder and a path that is not absolute', async () => {
    expect(await call('document:canWrite', join(granted, 'sub', 'in.txt'))).toMatchObject({ ok: false, reason: expect.stringMatching(/not a folder/) });
    expect(await call('document:canWrite', join(granted, 'missing'))).toMatchObject({ ok: false });
    expect(await call('document:canWrite', 'relative')).toMatchObject({ ok: false, reason: expect.stringMatching(/absolute/) });
  });
});
