/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, sep } from 'path';
import { makeTree, refusedBy, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

const picker = vi.hoisted(() => ({
  folder: vi.fn<(win: unknown, options: unknown) => Promise<{ canceled: boolean; filePaths: string[] }>>(),
}));

vi.mock('electron', () => ({ dialog: { showOpenDialog: picker.folder, showSaveDialog: vi.fn() } }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let base = '';
let granted = '';
let outside = '';
let access = testAccess();
let call: Call;

const canLinkFiles = await (async (): Promise<boolean> => {
  const probe = await mkdtemp(join(tmpdir(), 'brock-probe-'));
  try {
    await writeFile(join(probe, 'a'), 'a');
    await symlink(join(probe, 'a'), join(probe, 'b'), 'file');
    return true;
  } catch {
    return false;
  } finally {
    await rm(probe, { recursive: true, force: true });
  }
})();

const refused = (path: string): Promise<void> => refusedBy(access)(path);

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-grants-'));
  await mkdir(join(granted, 'sub', 'deep'));
  access = testAccess();
  call = sessionOf({ documents: access });
  picker.folder.mockReset();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('a folder grant', () => {
  it('lets the renderer read and write files at any depth', async () => {
    access.allowFolder(granted);
    expect(await call('document:readText', join(granted, 'sub', 'in.txt'))).toBe('inside');
    await call('document:writeText', join(granted, 'sub', 'deep', 'new.txt'), 'made');
    expect(await readFile(join(granted, 'sub', 'deep', 'new.txt'), 'utf8')).toBe('made');
    await call('document:write', join(granted, 'sub', 'in.txt'), new Uint8Array([104, 105]).buffer);
    expect(await readFile(join(granted, 'sub', 'in.txt'), 'utf8')).toBe('hi');
  });

  it('is empty until main grants it, and says what it returned', async () => {
    await refused(join(granted, 'sub', 'in.txt'));
    expect(access.allowFolder(granted)).toBe(granted);
    expect(await access.isAllowed(join(granted, 'sub', 'in.txt'))).toBe(true);
  });

  it('is given by the folder dialog, and a cancelled dialog grants nothing', async () => {
    picker.folder.mockResolvedValue({ canceled: true, filePaths: [granted] });
    expect(await call('document:openFolder')).toBeNull();
    await refused(join(granted, 'sub', 'in.txt'));
    picker.folder.mockResolvedValue({ canceled: false, filePaths: [granted] });
    expect(await call('document:openFolder', { title: 'Project folder', defaultPath: base })).toBe(granted);
    expect(picker.folder.mock.calls[1]?.[1]).toMatchObject({ title: 'Project folder', defaultPath: base, properties: ['openDirectory'] });
    expect(await call('document:readText', join(granted, 'sub', 'in.txt'))).toBe('inside');
  });

  it('can be revoked once', async () => {
    access.allowFolder(granted);
    expect(access.revokeFolder(granted)).toBe(true);
    await refused(join(granted, 'sub', 'in.txt'));
    expect(access.revokeFolder(granted)).toBe(false);
  });

  it('keeps every other path on the exact file rule', async () => {
    access.allowFolder(granted);
    await refused(join(outside, 'secret.txt'));
    await refused(base);
    await expect(access.resolve('granted/sub/in.txt')).rejects.toThrow(/absolute path/);
    access.allow(join(outside, 'secret.txt'));
    expect(await call('document:readText', join(outside, 'secret.txt'))).toBe('secret');
    await expect(call('document:readText', join(outside, 'other.txt'))).rejects.toThrow(/may not use/);
  });

  it('refuses a file, a missing folder, a relative path and a filesystem root', () => {
    expect(() => access.allowFolder(join(granted, 'sub', 'in.txt'))).toThrow(/not a folder/);
    expect(() => access.allowFolder(join(base, 'missing'))).toThrow();
    expect(() => access.allowFolder('granted')).toThrow(/absolute path/);
    expect(() => access.allowFolder(`${granted}${sep}..${sep}outside`)).toThrow(/plain folder path/);
    expect(() => access.allowFolder(sep)).toThrow(/below the filesystem root/);
  });
});

describe('escaping a folder grant', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('refuses a sibling whose name starts with the folder name', async () => {
    await mkdir(`${granted}-evil`);
    await writeFile(join(`${granted}-evil`, 'x.txt'), 'x');
    await refused(join(`${granted}-evil`, 'x.txt'));
  });

  it('refuses any dot dot segment, even one that stays inside', async () => {
    await refused(`${granted}${sep}..${sep}outside${sep}secret.txt`);
    await refused(`${granted}${sep}sub${sep}..${sep}..${sep}outside${sep}secret.txt`);
    await refused(`${granted}${sep}sub${sep}..${sep}sub${sep}in.txt`);
    await refused(`${granted}/../outside/secret.txt`);
    await expect(call('document:writeText', `${granted}${sep}..${sep}outside${sep}new.txt`, 'x')).rejects.toThrow(/may not use/);
  });

  it('refuses a path with a NUL', async () => {
    await expect(access.resolve(`${granted}${sep}sub${sep}in.txt\0.png`)).rejects.toThrow(/absolute path/);
  });

  it('refuses a folder link that points outside, to read, write or create', async () => {
    await symlink(outside, join(granted, 'portal'), dirLink);
    await refused(join(granted, 'portal', 'secret.txt'));
    await refused(join(granted, 'portal', 'new.txt'));
    await refused(join(granted, 'portal'));
    await expect(call('document:writeText', join(granted, 'portal', 'new.txt'), 'x')).rejects.toThrow(/may not use/);
    await expect(readFile(join(outside, 'new.txt'))).rejects.toThrow();
  });

  it('refuses a link to a link that points outside', async () => {
    await symlink(outside, join(base, 'hop'), dirLink);
    await symlink(join(base, 'hop'), join(granted, 'portal'), dirLink);
    await refused(join(granted, 'portal', 'secret.txt'));
  });

  it('refuses a folder link below a subfolder', async () => {
    await symlink(outside, join(granted, 'sub', 'deep', 'portal'), dirLink);
    await refused(join(granted, 'sub', 'deep', 'portal', 'secret.txt'));
  });

});

describe('escaping a folder grant through links', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('follows a link that stays inside the grant', async () => {
    await symlink(join(granted, 'sub'), join(granted, 'shortcut'), dirLink);
    expect(await access.resolve(join(granted, 'shortcut', 'in.txt'))).toBe(join(granted, 'sub', 'in.txt'));
    expect(await call('document:readText', join(granted, 'shortcut', 'in.txt'))).toBe('inside');
  });

  it.runIf(canLinkFiles)('refuses a file link that points outside, and a dangling one', async () => {
    await symlink(join(outside, 'secret.txt'), join(granted, 'peek.txt'), 'file');
    await symlink(join(outside, 'later.txt'), join(granted, 'later.txt'), 'file');
    await refused(join(granted, 'peek.txt'));
    await refused(join(granted, 'later.txt'));
    await expect(call('document:writeText', join(granted, 'later.txt'), 'x')).rejects.toThrow(/may not use/);
    await expect(readFile(join(outside, 'later.txt'))).rejects.toThrow();
  });

  it.runIf(canLinkFiles)('follows a file link that stays inside the grant', async () => {
    await symlink(join(granted, 'sub', 'in.txt'), join(granted, 'alias.txt'), 'file');
    expect(await call('document:readText', join(granted, 'alias.txt'))).toBe('inside');
  });

  it('refuses everything again when the granted folder is swapped for a link', async () => {
    await rm(granted, { recursive: true, force: true });
    await symlink(outside, granted, dirLink);
    await refused(join(granted, 'secret.txt'));
  });
});

describe('the spelling of a path inside a folder grant', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('matches case only where the file system does', async () => {
    const upper = join(granted, 'SUB', 'IN.TXT');
    if (process.platform === 'win32') expect(await call('document:readText', upper)).toBe('inside');
    else await refused(upper);
  });
});
