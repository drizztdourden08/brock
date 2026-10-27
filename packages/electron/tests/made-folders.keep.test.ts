/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, readdirSync } from 'fs';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'fs/promises';
import { basename, dirname, join } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree } from './folder-fixture';

vi.mock('electron', () => ({ app: { clearRecentDocuments: () => undefined, addRecentDocument: () => undefined }, dialog: {} }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let base = '';
let home = '';
let scratchRoot = '';
let appData = '';
let elsewhere = '';
let access: DocumentAccess;

beforeEach(async () => {
  ({ base } = await makeTree('brock-made-'));
  home = join(base, 'home');
  appData = join(home, 'AppData');
  scratchRoot = join(appData, 'Local', 'Temp');
  elsewhere = join(base, 'elsewhere');
  await mkdir(scratchRoot, { recursive: true });
  await mkdir(elsewhere);
  access = createDocumentAccess({ sensitiveRoots: () => ({ home: [home], trees: [appData] }), tempRoot: () => scratchRoot });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('a temp folder the app made this session', () => {
  it('is refused as an AppData folder until the app makes it, then passes', async () => {
    const stranger = await mkdtemp(join(scratchRoot, 'stranger-'));
    expect(() => access.allowFolder(stranger)).toThrow(/cannot be granted/);
    const made = access.createTempFolder('e2e-');
    expect(dirname(made)).toBe(scratchRoot);
    expect(basename(made).startsWith('e2e-')).toBe(true);
    expect(access.allowFolder(made)).toBe(made);
    await writeFile(join(made, 'a.txt'), 'x');
    expect((await access.list(made)).entries.map((entry) => entry.name)).toEqual(['a.txt']);
  });

  it('refuses a sibling temp folder the app did not make, and the folders around it', async () => {
    const made = access.createTempFolder();
    const sibling = await mkdtemp(join(scratchRoot, `${basename(made).slice(0, 6)}-`));
    expect(() => access.allowFolder(sibling)).toThrow(/cannot be granted/);
    expect(() => access.allowFolder(scratchRoot)).toThrow(/cannot be granted/);
    expect(() => access.allowFolder(dirname(scratchRoot))).toThrow(/cannot be granted/);
    expect(() => access.allowFolder(appData)).toThrow(/cannot be granted/);
  });

  it('lets a subfolder of a made folder pass', async () => {
    const made = access.createTempFolder();
    await mkdir(join(made, 'sub', 'deep'), { recursive: true });
    expect(access.allowFolder(join(made, 'sub', 'deep'))).toBe(join(made, 'sub', 'deep'));
  });
});

describe('links, clearing and limits for made temp folders', () => {
  it('judges a link inside a made folder by where it points', async () => {
    const made = access.createTempFolder();
    const strangerTree = join(appData, 'Roaming', 'Other');
    await mkdir(strangerTree, { recursive: true });
    await symlink(strangerTree, join(made, 'to-appdata'), dirLink);
    await symlink(elsewhere, join(made, 'to-elsewhere'), dirLink);
    expect(() => access.allowFolder(join(made, 'to-appdata'))).toThrow(/cannot be granted/);
    expect(access.allowFolder(join(made, 'to-elsewhere'))).toBe(elsewhere);
  });

  it('judges a link from outside that points into a made folder by its resolved path', async () => {
    const made = access.createTempFolder();
    const link = join(elsewhere, 'into-made');
    await symlink(made, link, dirLink);
    expect(access.allowFolder(link)).toBe(made);
  });

  it('is refused again once the made set is cleared', () => {
    const made = access.createTempFolder();
    access.forgetTempFolders();
    expect(() => access.allowFolder(made)).toThrow(/cannot be granted/);
    expect(existsSync(made)).toBe(true);
  });

  it('is not shared between two document access objects', () => {
    const made = access.createTempFolder();
    const other = createDocumentAccess({ sensitiveRoots: () => ({ home: [home], trees: [appData] }), tempRoot: () => scratchRoot });
    expect(() => other.allowFolder(made)).toThrow(/cannot be granted/);
  });

  it('keeps the other refusals: the home folder and the app folders', () => {
    const guarded = createDocumentAccess({ protectedRoots: () => [scratchRoot], sensitiveRoots: () => ({ home: [home], trees: [appData] }), tempRoot: () => scratchRoot });
    const made = guarded.createTempFolder();
    expect(() => guarded.allowFolder(made)).toThrow(/app's own folders/);
    expect(() => guarded.allowFolder(home)).toThrow(/home folder/);
  });

  it('refuses a prefix that is not a plain name and makes nothing', () => {
    const before = readdirSync(scratchRoot).length;
    for (const prefix of ['', '..', '../x', 'a/b', 'a\\b', 'x..y', '.hidden', 'a'.repeat(41)]) expect(() => access.createTempFolder(prefix), prefix).toThrow(/plain name prefix/);
    expect(readdirSync(scratchRoot)).toHaveLength(before);
  });
});
