/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyFile, mkdir, readFile, rm, symlink, writeFile } from 'fs/promises';
import { join, sep } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { MAX_REMEMBERED_FOLDERS, REMEMBERED_FILE } from '../src/main/documents/remembered-folders.constants';
import { RECENT_FILE } from '../src/main/documents/recent-documents.constants';
import { mainFolderMemory } from '../src/main/documents/main-folder-memory';
import { electronDialogMock } from './electron-dialog-mock';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', async () => (await import('./electron-dialog-mock')).electronDialogMock);

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const PROFILES = { load: (id: string) => Promise.resolve(id === 'p1' || id === 'p2' ? { id, name: id, created: 1, lastPlayed: 1 } : null) } as MainContext['profiles'];

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;
let call: Call;
let warnings: string[] = [];

const paths: MainContext['paths'] = { userData: (...segments) => join(base, 'user', ...segments), data: (...segments) => join(base, 'Data', ...segments) };
const log = (message: string): void => {
  warnings.push(message);
};
const fileOf = (profile: string): string => join(base, 'Data', 'profiles', profile, REMEMBERED_FILE);
const accessWith = (trees: string[]): DocumentAccess => {
  const made: DocumentAccess = testAccess({
    sensitiveRoots: () => ({ home: [], trees }),
    memory: () => mainFolderMemory({ paths, log, profiles: PROFILES, documents: made }),
  });
  return made;
};
const pick = async (folder: string, profile?: string): Promise<unknown> => {
  electronDialogMock.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: false, filePaths: [folder] });
  return call('document:openFolder', {}, profile);
};

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-remember-'));
  warnings = [];
  access = accessWith([]);
  call = sessionOf({ documents: access, paths, log, profiles: PROFILES });
  electronDialogMock.dialog.showOpenDialog.mockReset();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('remembering the folders the user picked', () => {
  it('remembers a folder picked in the dialog for the profile, signed', async () => {
    expect(await pick(granted, 'p1')).toBe(granted);
    expect(await access.rememberedFolders('p1')).toEqual([{ path: granted, name: 'granted', lastOpened: expect.any(Number) as number }]);
    expect(await access.rememberedFolders('p2')).toEqual([]);
    const stored = JSON.parse(await readFile(fileOf('p1'), 'utf8')) as { sig: string }[];
    expect(stored[0]?.sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it('still grants the folder when the picker has no profile or an unknown one, and remembers nothing', async () => {
    expect(await pick(granted)).toBe(granted);
    expect(await pick(granted, 'nobody')).toBe(granted);
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).resolves.toBeTruthy();
    expect(await access.rememberedFolders('p1')).toEqual([]);
    expect(warnings.some((line) => line.includes('not a profile'))).toBe(true);
  });

  it('never remembers a grant made by main code, unless main says so', async () => {
    access.allowFolder(granted);
    expect(await access.rememberedFolders('p1')).toEqual([]);
    await access.rememberFolder('p1', granted);
    expect(await access.rememberedFolders('p1')).toHaveLength(1);
  });

  it('refuses to remember a folder that is not granted', async () => {
    await expect(access.rememberFolder('p1', outside)).rejects.toThrow(/not a granted folder/);
    await expect(access.rememberFolder('p1', 'relative')).rejects.toThrow();
    expect(await access.rememberedFolders('p1')).toEqual([]);
  });

  it('keeps the newest first, one entry per folder, and at most the cap', async () => {
    const folders: string[] = [];
    for (let count = 0; count < MAX_REMEMBERED_FOLDERS + 2; count += 1) {
      const folder = join(base, `f${count}`);
      await mkdir(folder);
      folders.push(folder);
      await pick(folder, 'p1');
    }
    await pick(folders[5] as string, 'p1');
    const listed = (await access.rememberedFolders('p1')).map((entry) => entry.path);
    expect(listed).toHaveLength(MAX_REMEMBERED_FOLDERS);
    expect(listed[0]).toBe(folders[5]);
    expect(new Set(listed).size).toBe(listed.length);
  });

  it('drops a folder that is gone from the list', async () => {
    const gone = join(base, 'gone');
    await mkdir(gone);
    await pick(gone, 'p1');
    await pick(granted, 'p1');
    await rm(gone, { recursive: true });
    expect((await access.rememberedFolders('p1')).map((entry) => entry.path)).toEqual([granted]);
    await expect(access.regrant('p1', gone)).rejects.toThrow(/not a remembered folder/);
  });
});

const rememberThenRevoke = async (): Promise<void> => {
  await pick(granted, 'p1');
  access.revokeFolder(granted);
};

describe('granting a remembered folder again without the dialog', () => {
  beforeEach(rememberThenRevoke);

  it('restores the grant, and its files work again', async () => {
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
    expect(await access.regrant('p1', granted)).toBe(granted);
    expect((await access.list(granted)).entries.map((entry) => entry.name)).toEqual(['sub']);
    expect(await call('document:readText', join(granted, 'sub', 'in.txt'))).toBe('inside');
  });

  it('goes through the renderer channels with the profile', async () => {
    expect((await call('document:rememberedFolders', 'p1') as unknown[]).length).toBe(1);
    expect(await call('document:regrant', 'p1', granted)).toBe(granted);
    expect(await call('document:forgetFolder', 'p1', granted)).toBe(true);
    await expect(call('document:regrant', 'p1', granted)).rejects.toThrow(/not a remembered folder/);
    await expect(call('document:regrant', 'nobody', granted)).rejects.toThrow(/not a profile/);
    await expect(call('document:rememberedFolders', 'nobody')).rejects.toThrow(/not a profile/);
  });

  it('refuses a folder that was granted but never remembered, and a folder of another profile', async () => {
    access.allowFolder(outside);
    access.revokeFolder(outside);
    await expect(access.regrant('p1', outside)).rejects.toThrow(/not a remembered folder/);
    await expect(access.regrant('p2', granted)).rejects.toThrow(/not a remembered folder/);
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
  });

  it('refuses paths that are not plain', async () => {
    for (const path of ['relative', `${granted}${sep}..${sep}granted`, '']) await expect(access.regrant('p1', path), path).rejects.toThrow();
  });

});

describe('a remembered list that was tampered with', () => {
  beforeEach(rememberThenRevoke);

  it('refuses an entry that was edited, unsigned, signed by hand or copied from another profile', async () => {
    const stored = JSON.parse(await readFile(fileOf('p1'), 'utf8')) as { path: string; sig: string }[];
    const attempts: unknown[][] = [
      [{ ...stored[0], path: outside }],
      [{ ...stored[0], sig: 'a'.repeat(64) }],
      [{ path: outside, name: 'outside', lastOpened: 1 }],
      [{ path: outside, name: 'outside', lastOpened: 1, sig: stored[0]?.sig }],
    ];
    for (const entries of attempts) {
      await writeFile(fileOf('p1'), JSON.stringify(entries));
      await expect(access.regrant('p1', outside)).rejects.toThrow(/not a remembered folder/);
      expect(await access.rememberedFolders('p1')).toEqual([]);
    }
    await mkdir(join(base, 'Data', 'profiles', 'p2'), { recursive: true });
    await writeFile(fileOf('p1'), JSON.stringify(stored));
    await copyFile(fileOf('p1'), fileOf('p2'));
    await expect(access.regrant('p2', granted)).rejects.toThrow(/not a remembered folder/);
    expect(await access.regrant('p1', granted)).toBe(granted);
  });

  it('refuses a signed file entry from the recent list moved into the folder list', async () => {
    const file = join(granted, 'sub', 'in.txt');
    electronDialogMock.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: false, filePaths: [file] });
    await call('document:open', {}, 'p1');
    await copyFile(join(base, 'Data', 'profiles', 'p1', RECENT_FILE), fileOf('p1'));
    expect(await access.rememberedFolders('p1')).toEqual([]);
    await expect(access.regrant('p1', file)).rejects.toThrow(/not a remembered folder/);
  });

});

describe('a remembered folder that is no longer fit to grant', () => {
  beforeEach(rememberThenRevoke);

  it('checks the grant root rules again today', async () => {
    const strict = accessWith([granted]);
    await expect(strict.regrant('p1', granted)).rejects.toThrow(/cannot be granted/);
    await expect(strict.resolve(join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
    expect(await strict.rememberedFolders('p1')).toHaveLength(1);
  });

  it('refuses a folder that has been replaced by a link to somewhere else', async () => {
    await rm(granted, { recursive: true });
    await symlink(outside, granted, dirLink);
    await expect(access.regrant('p1', granted)).rejects.toThrow(/leads somewhere else/);
    await expect(access.resolve(join(outside, 'secret.txt'))).rejects.toThrow(/may not use/);
  });

});

describe('forgetting a remembered folder', () => {
  beforeEach(rememberThenRevoke);

  it('is undone by forgetting the folder, which tells whether there was one', async () => {
    expect(await access.forgetFolder('p1', granted)).toBe(true);
    expect(await access.forgetFolder('p1', granted)).toBe(false);
    expect(await access.rememberedFolders('p1')).toEqual([]);
    await expect(access.regrant('p1', granted)).rejects.toThrow(/not a remembered folder/);
    await expect(access.forgetFolder('p1', 'relative')).rejects.toThrow();
  });
});
