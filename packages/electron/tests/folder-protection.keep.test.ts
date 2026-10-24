/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink, writeFile } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { pathExists } from '../src/main/documents/path-exists';
import { createRecentDocuments } from '../src/main/documents/recent-documents';
import { RECENT_FILE } from '../src/main/documents/recent-documents.constants';
import type { StoredRecent } from '../src/main/documents/recent-documents.type';
import { createSigningKey } from '../src/main/documents/signing-key';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

vi.mock('electron', () => ({ dialog: {}, app: { addRecentDocument: () => undefined, clearRecentDocuments: () => undefined } }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const ONLY_P1 = { load: (id: string) => Promise.resolve(id === 'p1' ? { id, name: id, created: 1, lastPlayed: 1 } : null) } as MainContext['profiles'];

let base = '';
let granted = '';
let outside = '';
let appDir = '';
let access: DocumentAccess;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-protect-'));
  appDir = join(base, 'app');
  await mkdir(join(appDir, 'Data', 'profiles', 'p1'), { recursive: true });
  await writeFile(join(appDir, 'Data', 'app.json'), '{}');
  access = testAccess({ protectedRoots: () => [appDir, join(base, 'missing-install')] });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('the folders of the app itself', () => {
  const inApp = (): string[] => [join(appDir, 'app.json'), join(appDir, 'Data', 'app.json'), join(appDir, 'Data', 'profiles', 'p1', RECENT_FILE), join(base, 'bin', 'app.exe'), join(base, 'bin', 'resources', 'app.asar')];

  beforeEach(async () => {
    await mkdir(join(base, 'bin', 'resources'), { recursive: true });
    await writeFile(join(base, 'bin', 'app.exe'), 'exe');
    await writeFile(join(base, 'bin', 'resources', 'app.asar'), 'asar');
    await writeFile(join(appDir, 'app.json'), '{}');
    await writeFile(join(appDir, 'Data', 'profiles', 'p1', RECENT_FILE), '[]');
    access = testAccess({ protectedRoots: () => [appDir, join(appDir, 'Data'), join(base, 'bin'), join(base, 'bin', 'resources'), join(base, 'missing-install')] });
  });

  it('refuses a grant that is one of them or sits inside one', () => {
    for (const folder of [appDir, join(appDir, 'Data'), join(base, 'bin', 'resources')]) expect(() => access.allowFolder(folder)).toThrow(/app's own folders/);
    expect(access.allowFolder(granted)).toBe(granted);
  });

  it('keeps them out of reach under a grant that holds them, like a home folder', async () => {
    expect(access.allowFolder(base)).toBe(base);
    for (const path of inApp()) {
      await expect(access.resolve(path)).rejects.toThrow(/may not use/);
      await expect(access.resolve(join(path, '..', 'x'))).rejects.toThrow(/may not use/);
      expect(await access.isAllowed(path)).toBe(false);
    }
    await expect(access.resolve(join(appDir, 'Data', 'new.json'))).rejects.toThrow(/may not use/);
    expect(await access.resolve(join(granted, 'sub', 'in.txt'))).toBe(join(granted, 'sub', 'in.txt'));
    expect(await access.resolve(join(base, 'outside', 'fresh.txt'))).toBe(join(base, 'outside', 'fresh.txt'));
  });

  it('refuses to list them and hides them when listing the parent', async () => {
    access.allowFolder(base);
    for (const folder of [appDir, join(appDir, 'Data'), join(base, 'bin'), join(base, 'bin', 'resources')]) {
      await expect(access.list(folder)).rejects.toThrow(/not inside a granted folder/);
    }
    const names = (await access.list(base)).entries.map((entry) => entry.name);
    expect(names).toEqual(expect.arrayContaining(['granted', 'outside']));
    expect(names).not.toContain('app');
    expect(names).not.toContain('bin');
    const tree = (await access.list(base, { recursive: true })).entries.map((entry) => entry.path);
    expect(tree).toContain(join(granted, 'sub', 'in.txt'));
    expect(tree.filter((path) => path.startsWith(appDir) || path.startsWith(join(base, 'bin')))).toEqual([]);
  });

  it('keeps them out of reach through a link and when they do not exist yet', async () => {
    access.allowFolder(base);
    await symlink(join(appDir, 'Data'), join(granted, 'sneak'), dirLink);
    await expect(access.resolve(join(granted, 'sneak', 'app.json'))).rejects.toThrow(/may not use/);
    expect((await access.list(granted)).entries.map((entry) => entry.name)).not.toContain('sneak');
    await rm(appDir, { recursive: true, force: true });
    await expect(access.resolve(join(appDir, 'Data', 'app.json'))).rejects.toThrow(/may not use/);
  });
});

describe('the recent list as a source of authority', () => {
  const key = () => Promise.resolve(Buffer.alloc(32, 7));
  const os = { add: vi.fn(), clear: vi.fn() };
  const make = (given = key) => createRecentDocuments({ profileDir: (id) => join(base, 'profiles', id), exists: pathExists, allow: access.allow, key: given, os });
  const fileOf = (id: string): string => join(base, 'profiles', id, RECENT_FILE);
  const secret = (): string => join(outside, 'secret.txt');

  it('drops forged, unsigned and moved entries, and refuses to reopen them', async () => {
    const recent = make();
    const mine = join(granted, 'sub', 'in.txt');
    await recent.record('p1', mine);
    const stored = JSON.parse(await readFile(fileOf('p1'), 'utf8')) as StoredRecent[];
    const forged = [
      ...stored,
      { path: secret(), name: 'secret.txt', lastOpened: 9, sig: '00' },
      { ...stored[0], path: secret() },
      { path: secret(), name: 'secret.txt', lastOpened: 9 },
    ];
    await writeFile(fileOf('p1'), JSON.stringify(forged));
    expect((await recent.list('p1')).map((entry) => entry.path)).toEqual([mine]);
    await expect(recent.reopen('p1', secret())).rejects.toThrow(/not in the recent/);
    expect(access.exact(secret())).toBe(false);
  });

  it('does not carry an entry to another profile or to another install key', async () => {
    const recent = make();
    await recent.record('p1', join(granted, 'sub', 'in.txt'));
    await mkdir(join(base, 'profiles', 'p2'), { recursive: true });
    await writeFile(fileOf('p2'), await readFile(fileOf('p1')));
    expect(await recent.list('p2')).toEqual([]);
    expect(await make(() => Promise.resolve(Buffer.alloc(32, 8))).list('p1')).toEqual([]);
  });

  it('reopens an entry main recorded, and hands out the plain record', async () => {
    const recent = make();
    const mine = join(granted, 'sub', 'in.txt');
    await recent.record('p1', mine);
    expect(await recent.list('p1')).toEqual([{ path: mine, name: 'in.txt', lastOpened: expect.any(Number) as number }]);
    expect(await recent.reopen('p1', mine)).toBe(mine);
    expect(access.exact(mine)).toBe(true);
  });

  it('keeps one signing key for the install', async () => {
    const file = join(base, 'Data', 'recent-signing.key');
    const first = await createSigningKey(() => file)();
    expect(first).toHaveLength(32);
    expect(await createSigningKey(() => file)()).toEqual(first);
  });
});

describe('recent documents and folder grants', () => {
  let call: Call;
  const paths: MainContext['paths'] = { userData: (...segments) => join(base, ...segments), data: (...segments) => join(base, 'Data', ...segments) };

  beforeEach(() => {
    call = sessionOf({ documents: access, paths, log: vi.fn(), profiles: ONLY_P1 });
    access.allowFolder(granted);
  });

  it('does not list a file reached only through a folder grant, so a revoke ends the access', async () => {
    const reached = join(granted, 'sub', 'w.txt');
    await call('document:writeText', reached, 'x', 'p1');
    expect(await call('document:recent', 'p1')).toEqual([]);
    access.revokeFolder(granted);
    await expect(call('document:openRecent', 'p1', reached)).rejects.toThrow(/not in the recent/);
    await expect(call('document:readText', reached)).rejects.toThrow(/may not use/);
  });

  it('still lists a file the user picked, even inside a granted folder', async () => {
    const picked = join(granted, 'sub', 'in.txt');
    access.allow(picked);
    await call('document:writeText', picked, 'y', 'p1');
    expect(((await call('document:recent', 'p1')) as { path: string }[]).map((entry) => entry.path)).toEqual([picked]);
  });

  it('refuses a profile that does not exist and creates nothing for it', async () => {
    await expect(call('document:recent', 'ghost')).rejects.toThrow(/not a profile/);
    await expect(call('document:openRecent', 'ghost', join(granted, 'sub', 'in.txt'))).rejects.toThrow(/not a profile/);
    await expect(call('document:recoverable', 'ghost')).rejects.toThrow(/not a profile/);
    await call('document:writeText', join(granted, 'sub', 'g.txt'), 'x', 'ghost');
    expect(existsSync(join(base, 'Data', 'profiles', 'ghost'))).toBe(false);
  });
});

describe('revoking a folder by another spelling', () => {
  it('does not find the grant through a link the grant was never made with', async () => {
    await symlink(granted, join(base, 'alias'), dirLink);
    access.allowFolder(granted);
    expect(access.revokeFolder(join(base, 'alias'))).toBe(false);
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).resolves.toBeTruthy();
    expect(access.revokeFolder(granted)).toBe(true);
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
  });

  it('finds a grant made through a link when revoked by the real path', async () => {
    await symlink(granted, join(base, 'alias'), dirLink);
    expect(access.allowFolder(join(base, 'alias'))).toBe(granted);
    expect(access.revokeFolder(granted)).toBe(true);
    expect(access.revokeFolder(join(base, 'alias'))).toBe(false);
  });

  it('finds the grant by the spelling it was made with after the folder is gone', async () => {
    access.allowFolder(granted);
    await rm(granted, { recursive: true, force: true });
    expect(access.revokeFolder(granted)).toBe(true);
  });
});
