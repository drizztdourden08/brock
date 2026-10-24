/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, symlink, utimes, writeFile } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { mainRecent } from '../src/main/documents/main-recent';
import { knownProfiles, makeBase, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

const electron = vi.hoisted(() => ({
  dialog: { showOpenDialog: vi.fn(), showSaveDialog: vi.fn() },
  app: { addRecentDocument: vi.fn(), clearRecentDocuments: vi.fn() },
}));

vi.mock('electron', () => electron);

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;
let call: Call;
let appState = '';

const paths: MainContext['paths'] = { userData: (...segments) => join(base, ...segments), data: (...segments) => join(base, 'Data', ...segments) };

const files = {
  readText: (path: string): Promise<string | null> => Promise.resolve(path === 'app.json' ? appState : null),
} as MainContext['files'];

const entriesOf = async (...args: Parameters<DocumentAccess['list']>) => (await access.list(...args)).entries;

const names = (entries: { name: string }[]): string[] => entries.map((entry) => entry.name);

beforeEach(async () => {
  base = await makeBase('brock-listing-');
  granted = join(base, 'granted');
  outside = join(base, 'outside');
  await mkdir(join(granted, 'docs', 'deep'), { recursive: true });
  await mkdir(outside);
  await writeFile(join(granted, 'a.bxel'), 'aaaa');
  await writeFile(join(granted, 'B.BXEL'), 'bb');
  await writeFile(join(granted, 'notes.txt'), 'n');
  await writeFile(join(granted, 'docs', 'c.bxel'), 'c');
  await writeFile(join(granted, 'docs', 'deep', 'd.png'), 'd');
  access = testAccess({ recent: (profileId) => mainRecent({ paths, documents: access, files, log: vi.fn(), profiles: knownProfiles }, profileId) });
  appState = JSON.stringify({ lastProfileId: null });
  call = sessionOf({ documents: access, files, paths, log: vi.fn() });
  electron.dialog.showOpenDialog.mockReset();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('listing a granted folder', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('lists the folder level with kind, size and time, sorted by name', async () => {
    const stamp = new Date('2026-01-02T03:04:05Z');
    await utimes(join(granted, 'a.bxel'), stamp, stamp);
    const entries = await entriesOf(granted);
    expect(names(entries)).toEqual(['a.bxel', 'B.BXEL', 'docs', 'notes.txt']);
    expect(entries[0]).toEqual({ path: join(granted, 'a.bxel'), name: 'a.bxel', kind: 'file', size: 4, modified: stamp.getTime(), link: false });
    expect(entries[2]).toMatchObject({ name: 'docs', kind: 'folder', size: 0, link: false });
  });

  it('lists a subfolder, and the whole tree when recursive', async () => {
    expect(names(await entriesOf(join(granted, 'docs')))).toEqual(['c.bxel', 'deep']);
    const tree = await entriesOf(granted, { recursive: true });
    expect(tree.map((entry) => entry.path)).toEqual([
      join(granted, 'a.bxel'), join(granted, 'B.BXEL'), join(granted, 'docs'), join(granted, 'docs', 'c.bxel'),
      join(granted, 'docs', 'deep'), join(granted, 'docs', 'deep', 'd.png'), join(granted, 'notes.txt'),
    ]);
  });

  it('keeps only files of the wanted extensions, with or without a dot and in any case', async () => {
    expect(names(await entriesOf(granted, { extensions: ['bxel'] }))).toEqual(['a.bxel', 'B.BXEL']);
    expect(names(await entriesOf(granted, { extensions: ['.BXEL', 'txt'] }))).toEqual(['a.bxel', 'B.BXEL', 'notes.txt']);
    expect(names(await entriesOf(granted, { extensions: ['bxel', 'png'], recursive: true }))).toEqual(['a.bxel', 'B.BXEL', 'c.bxel', 'd.png']);
    expect(names(await entriesOf(granted, { extensions: [] }))).toHaveLength(4);
  });

  it('refuses malformed options', async () => {
    await expect(access.list(granted, { extensions: 'bxel' } as never)).rejects.toThrow(/list of strings/);
    await expect(access.list(granted, { extensions: [1] } as never)).rejects.toThrow(/list of strings/);
  });

  it('refuses a folder that is not granted, or that climbs out', async () => {
    await expect(access.list(outside)).rejects.toThrow(/not inside a granted folder/);
    await expect(access.list(base)).rejects.toThrow(/not inside a granted folder/);
    await expect(access.list(`${granted}/../outside`)).rejects.toThrow(/not inside a granted folder/);
    await expect(access.list('granted')).rejects.toThrow(/absolute path/);
  });

});

describe('listing a folder that holds links', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('flags a link that stays inside and leaves out one that points outside', async () => {
    await symlink(join(granted, 'docs'), join(granted, 'inner'), dirLink);
    await symlink(outside, join(granted, 'portal'), dirLink);
    const entries = await entriesOf(granted);
    expect(names(entries)).toContain('inner');
    expect(names(entries)).not.toContain('portal');
    expect(entries.find((entry) => entry.name === 'inner')).toMatchObject({ kind: 'folder', link: true });
  });

  it('does not walk into a link, even one that stays inside', async () => {
    await symlink(join(granted, 'docs'), join(granted, 'inner'), dirLink);
    await symlink(granted, join(granted, 'docs', 'loop'), dirLink);
    const tree = await entriesOf(granted, { recursive: true });
    expect(tree.filter((entry) => entry.path.includes('inner') && entry.name !== 'inner')).toEqual([]);
    expect(tree.filter((entry) => entry.path.includes('loop') && entry.name !== 'loop')).toEqual([]);
    expect(tree.length).toBeLessThan(12);
  });

  it('refuses a granted folder that is listed through a link to outside', async () => {
    await symlink(outside, join(granted, 'portal'), dirLink);
    await expect(access.list(join(granted, 'portal'))).rejects.toThrow(/not inside a granted folder/);
  });

  it('stops listing a folder once the grant is revoked', async () => {
    access.revokeFolder(granted);
    await expect(access.list(granted)).rejects.toThrow(/not inside a granted folder/);
  });

  it('answers the renderer over document:list under the same rule', async () => {
    const listed = (await call('document:list', granted, { extensions: ['bxel'] })) as { entries: { name: string }[] };
    expect(names(listed.entries)).toEqual(['a.bxel', 'B.BXEL']);
    await expect(call('document:list', outside)).rejects.toThrow(/not inside a granted folder/);
    await expect(call('document:list', 42)).rejects.toThrow(/absolute path/);
  });
});

describe('the recent list for main code', () => {
  const open = async (path: string, profileId: string): Promise<void> => {
    electron.dialog.showOpenDialog.mockResolvedValue({ canceled: false, filePaths: [path] });
    await call('document:open', undefined, profileId);
  };

  it('gives main the list the renderer sees, newest first, for a named profile', async () => {
    const first = join(granted, 'a.bxel');
    const second = join(granted, 'notes.txt');
    await open(first, 'p1');
    await open(second, 'p1');
    await open(join(granted, 'docs', 'c.bxel'), 'p2');
    const mine = await access.recent('p1');
    expect(mine.map((entry) => entry.path)).toEqual([second, first]);
    expect(mine).toEqual(await call('document:recent', 'p1'));
    expect((await access.recent('p2')).map((entry) => entry.name)).toEqual(['c.bxel']);
  });

  it('drops files that are gone, like the renderer list', async () => {
    await open(join(granted, 'a.bxel'), 'p1');
    await rm(join(granted, 'a.bxel'));
    expect(await access.recent('p1')).toEqual([]);
  });

  it('reads the last used profile when none is named', async () => {
    await open(join(granted, 'a.bxel'), 'p1');
    expect(await access.recent()).toEqual([]);
    appState = JSON.stringify({ lastProfileId: 'p1' });
    expect((await access.recent()).map((entry) => entry.name)).toEqual(['a.bxel']);
  });

  it('refuses an unsafe profile id and is empty without a recent source', async () => {
    await expect(access.recent('../p1')).rejects.toThrow();
    expect(await testAccess().recent('p1')).toEqual([]);
  });
});
