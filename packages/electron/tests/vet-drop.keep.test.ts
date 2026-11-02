/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { createDropTickets } from '../src/main/documents/drop-tickets';
import { DROP_LIMIT } from '../src/main/documents/vet-drop.constants';
import { vetDrop } from '../src/main/documents/vet-drop';
import { makeTree } from './folder-fixture';

vi.mock('electron', () => ({ dialog: {}, app: {} }));

let base = '';
let art = '';
let appData = '';
let access: DocumentAccess;
const dropped = (): boolean => true;

beforeEach(async () => {
  ({ base } = await makeTree('brock-drop-'));
  const home = join(base, 'home');
  appData = join(home, 'AppData');
  art = join(home, 'art');
  await mkdir(appData, { recursive: true });
  await mkdir(art);
  await writeFile(join(art, 'a.png'), 'x');
  await writeFile(join(appData, 'token.txt'), 'x');
  access = createDocumentAccess({ sensitiveRoots: () => ({ home: [home], trees: [appData] }) });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('K4 vetting dropped paths in main', { tags: ['critical'] }, () => {
  it('grants a dropped file and folder, then lets the renderer use them', async () => {
    const [file, folder] = await vetDrop(access, [join(art, 'a.png'), art], dropped);
    expect(file).toMatchObject({ kind: 'file', granted: true });
    expect(folder).toMatchObject({ kind: 'folder', granted: true });
    expect(await access.isAllowed(join(art, 'a.png'))).toBe(true);
  });

  it('refuses a file inside AppData and a folder that holds the home folder', async () => {
    const [secret, home] = await vetDrop(access, [join(appData, 'token.txt'), join(base, 'home')], dropped);
    expect(secret).toMatchObject({ kind: 'file', granted: false });
    expect(home).toMatchObject({ kind: 'folder', granted: false });
    expect(await access.isAllowed(join(appData, 'token.txt'))).toBe(false);
  });

  it('refuses a missing path, a relative path and a path with dot dot, and keeps going', async () => {
    const answers = await vetDrop(access, [join(art, 'gone.png'), 'a.png', `${art}/../art/a.png`, join(art, 'a.png')], dropped);
    expect(answers.map((answer) => answer.granted)).toEqual([false, false, false, true]);
  });

  it('refuses a list that is not an array or holds too many items', async () => {
    await expect(vetDrop(access, 'C:\\a.png', dropped)).rejects.toThrow(/array/);
    await expect(vetDrop(access, Array.from({ length: DROP_LIMIT + 1 }, () => art), dropped)).rejects.toThrow(/at most/);
  });
});

describe('K4 a path that was not dropped is never granted', () => {
  it('refuses a path with no ticket and grants nothing', { tags: ['critical'] }, async () => {
    const tickets = createDropTickets();
    const [file, folder] = await vetDrop(access, [join(art, 'a.png'), art], (path) => tickets.take(1, path));
    expect(file).toMatchObject({ granted: false, reason: 'The path was not dropped' });
    expect(folder).toMatchObject({ granted: false, reason: 'The path was not dropped' });
    expect(await access.isAllowed(join(art, 'a.png'))).toBe(false);
  });

  it('grants a path that a trusted drop of the same window ticketed, once', { tags: ['critical'] }, async () => {
    const tickets = createDropTickets();
    tickets.issue(1, [art]);
    const claim = (path: string): boolean => tickets.take(1, path);
    expect((await vetDrop(access, [art], claim))[0]).toMatchObject({ kind: 'folder', granted: true });
    expect((await vetDrop(access, [art], claim))[0]).toMatchObject({ granted: false, reason: 'The path was not dropped' });
  });

  it('refuses a path that was dropped in another window', { tags: ['critical'] }, async () => {
    const tickets = createDropTickets();
    tickets.issue(2, [art]);
    expect((await vetDrop(access, [art], (path) => tickets.take(1, path)))[0]).toMatchObject({ granted: false });
    expect(await access.isAllowed(join(art, 'a.png'))).toBe(false);
  });
});
