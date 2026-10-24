/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { mainFolderMemory } from '../src/main/documents/main-folder-memory';
import { electronDialogMock } from './electron-dialog-mock';
import { makeBase, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', async () => (await import('./electron-dialog-mock')).electronDialogMock);

const PROFILES = { load: (id: string) => Promise.resolve(id === 'p1' ? { id, name: id, created: 1, lastPlayed: 1 } : null) } as MainContext['profiles'];

let base = '';
let assets = '';
let palettes = '';
let access: DocumentAccess;
let call: Call;
let confirm: ReturnType<typeof vi.fn<MainContext['dialogs']['confirm']>>;
let automation = false;

const paths: MainContext['paths'] = { userData: (...segments) => join(base, 'user', ...segments), data: (...segments) => join(base, 'Data', ...segments) };
const start = (home: string[] = []): void => {
  const made: DocumentAccess = testAccess({
    sensitiveRoots: () => ({ home, trees: [] }),
    memory: () => mainFolderMemory({ paths, log: () => undefined, profiles: PROFILES, documents: made }),
  });
  access = made;
  call = sessionOf({
    documents: access,
    paths,
    profiles: PROFILES,
    log: () => undefined,
    dialogs: { confirm },
    flags: { isAutomationLaunch: () => automation, hasFlag: () => false } as unknown as MainContext['flags'],
    product: { name: 'Bxel' } as MainContext['product'],
  });
};
const openFile = (opts: unknown, profile?: string): Promise<unknown> => {
  electronDialogMock.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: false, filePaths: [join(assets, 'hero.json')] });
  return call('document:open', opts, profile);
};
const saveFile = (opts: unknown, profile?: string): Promise<unknown> => {
  electronDialogMock.dialog.showSaveDialog.mockResolvedValueOnce({ canceled: false, filePath: join(assets, 'new.json') });
  return call('document:saveAs', opts, profile);
};
const reads = (path: string): Promise<boolean> => access.resolve(path).then(() => true, () => false);

beforeEach(async () => {
  base = await makeBase('brock-grant-folder-');
  assets = join(base, 'proj', 'assets');
  palettes = join(base, 'proj', 'palettes');
  await mkdir(join(assets, 'inner'), { recursive: true });
  await mkdir(palettes, { recursive: true });
  await writeFile(join(assets, 'hero.json'), '{}');
  await writeFile(join(assets, 'side.json'), '{}');
  await writeFile(join(palettes, 'warm.pal'), 'warm');
  automation = false;
  confirm = vi.fn<MainContext['dialogs']['confirm']>().mockResolvedValue(true);
  electronDialogMock.dialog.showOpenDialog.mockReset();
  electronDialogMock.dialog.showSaveDialog.mockReset();
  start();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('granting the folder of a picked file', () => {
  it('asks nothing and answers the plain path when the option is not set', async () => {
    expect(await openFile({})).toBe(join(assets, 'hero.json'));
    expect(confirm).not.toHaveBeenCalled();
    expect(await reads(join(assets, 'side.json'))).toBe(false);
  });

  it('names the exact folder and product, then grants the folder on yes', async () => {
    const answer = await openFile({ grantFolder: 'ask' }, 'p1');
    expect(answer).toEqual({ path: join(assets, 'hero.json'), folderGranted: true, folder: assets });
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm.mock.calls[0]?.[0].message).toBe(`Allow Bxel to read and write the folder ${assets}?`);
    expect(await reads(join(assets, 'side.json'))).toBe(true);
    expect(await reads(join(palettes, 'warm.pal'))).toBe(false);
  });

  it('remembers the granted folder for the profile like a picked folder', async () => {
    await openFile({ grantFolder: 'ask' }, 'p1');
    expect((await access.rememberedFolders('p1')).map((entry) => entry.path)).toEqual([assets]);
  });

  it('keeps only the file on no and says why', async () => {
    confirm.mockResolvedValue(false);
    const answer = await openFile({ grantFolder: 'ask' }, 'p1');
    expect(answer).toEqual({ path: join(assets, 'hero.json'), folderGranted: false, reason: expect.any(String) as string });
    expect(await reads(join(assets, 'hero.json'))).toBe(true);
    expect(await reads(join(assets, 'side.json'))).toBe(false);
    expect(await access.rememberedFolders('p1')).toEqual([]);
  });

  it('works on saveAs and sends the profile along', async () => {
    const answer = await saveFile({ grantFolder: 'ask' }, 'p1');
    expect(answer).toEqual({ path: join(assets, 'new.json'), folderGranted: true, folder: assets });
    expect(await reads(join(assets, 'side.json'))).toBe(true);
    expect((await access.rememberedFolders('p1')).map((entry) => entry.path)).toEqual([assets]);
  });

  it('answers null for a cancelled dialog without asking', async () => {
    electronDialogMock.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: true, filePaths: [] });
    expect(await call('document:open', { grantFolder: 'ask' })).toBeNull();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('refuses an option it does not know and grants nothing', async () => {
    for (const grantFolder of ['all', { ask: false }, { ask: true, levels: -1 }, { ask: true, levels: 1.5 }, 3]) {
      expect(await openFile({ grantFolder })).toMatchObject({ folderGranted: false });
    }
    expect(confirm).not.toHaveBeenCalled();
    expect(await reads(join(assets, 'side.json'))).toBe(false);
  });
});

describe('widening by levels', () => {
  it('covers the parent folder with one level and names it in the dialog', async () => {
    const proj = join(base, 'proj');
    const answer = await openFile({ grantFolder: { ask: true, levels: 1 } });
    expect(answer).toEqual({ path: join(assets, 'hero.json'), folderGranted: true, folder: proj });
    expect(confirm.mock.calls[0]?.[0].message).toContain(proj);
    expect(await reads(join(palettes, 'warm.pal'))).toBe(true);
  });

  it('grants the file folder for levels 0 and for a missing levels', async () => {
    expect(await openFile({ grantFolder: { ask: true, levels: 0 } })).toMatchObject({ folder: assets });
    expect(await openFile({ grantFolder: { ask: true } })).toMatchObject({ folder: assets });
  });

  it('caps the levels at 2', async () => {
    const answer = await openFile({ grantFolder: { ask: true, levels: 9 } });
    expect(answer).toMatchObject({ folderGranted: true, folder: base });
  });
});

describe('refused roots', () => {
  it('falls back to the widest level that is allowed', async () => {
    start([join(base, 'proj')]);
    const answer = await openFile({ grantFolder: { ask: true, levels: 2 } });
    expect(answer).toEqual({ path: join(assets, 'hero.json'), folderGranted: true, folder: assets });
    expect(confirm.mock.calls[0]?.[0].message).toContain(assets);
    expect(await reads(join(palettes, 'warm.pal'))).toBe(false);
  });

  it('grants no folder when every level is refused, asks nothing and keeps the file', async () => {
    start([join(assets, 'inner')]);
    const answer = await openFile({ grantFolder: { ask: true, levels: 2 } });
    expect(answer).toEqual({ path: join(assets, 'hero.json'), folderGranted: false, reason: expect.stringContaining('home folder') as string });
    expect(confirm).not.toHaveBeenCalled();
    expect(await reads(join(assets, 'hero.json'))).toBe(true);
    expect(await reads(join(assets, 'side.json'))).toBe(false);
  });
});

describe('automation launches', () => {
  it('never shows the dialog and says the folder was not granted', async () => {
    automation = true;
    const answer = await openFile({ grantFolder: { ask: true, levels: 1 } }, 'p1');
    expect(answer).toMatchObject({ path: join(assets, 'hero.json'), folderGranted: false, reason: expect.any(String) as string });
    expect(confirm).not.toHaveBeenCalled();
    expect(await reads(join(assets, 'side.json'))).toBe(false);
    expect(await access.rememberedFolders('p1')).toEqual([]);
  });
});
