/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { listFolder } from '../src/main/documents/list-folder';
import { LIST_LIMITS } from '../src/main/documents/list-limits.constants';
import { pathInside } from '../src/main/documents/path-inside';
import { pathKey } from '../src/main/documents/path-key';
import { unsafeSegments } from '../src/main/documents/unsafe-segments';
import { makeTree } from './folder-fixture';

const windows = process.platform === 'win32';

const onWindows = <T>(run: () => T): T => {
  const real = process.platform;
  Object.defineProperty(process, 'platform', { value: 'win32' });
  try {
    return run();
  } finally {
    Object.defineProperty(process, 'platform', { value: real });
  }
};

let base = '';
let granted = '';
let access: DocumentAccess;

const limited = (limits: Partial<typeof LIST_LIMITS>): DocumentAccess => {
  const limitedAccess = createDocumentAccess({ limits });
  limitedAccess.allowFolder(granted);
  return limitedAccess;
};

beforeEach(async () => {
  ({ base, granted } = await makeTree('brock-hardening-'));
  access = createDocumentAccess();
  access.allowFolder(granted);
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('Windows names that Explorer cannot handle', () => {
  it('rejects a segment that ends in a dot or a space, or in a lookalike dot', () => {
    const bad = ['x.', 'x ', '...', 'x. ', 'x\uff0e', 'x\u2024', 'x\u3002', 'x\ufe52', 'x\u00a0'];
    for (const name of bad) expect(onWindows(() => unsafeSegments(`C:\\g\\${name}\\file.txt`))).toBe(true);
    for (const name of bad) expect(onWindows(() => unsafeSegments(`C:\\g\\file\\${name}`))).toBe(true);
  });

  it('accepts ordinary names, dot files and a single dot segment', () => {
    for (const name of ['.hidden', 'a b.txt', 'a.b.c', 'x\uff0ey']) expect(onWindows(() => unsafeSegments(`C:\\g\\${name}`))).toBe(false);
    expect(onWindows(() => unsafeSegments('C:\\g\\.\\x.txt'))).toBe(false);
  });

  it('rejects every reserved device name, with superscript digits and an extension', () => {
    const devices = ['CON', 'prn', 'AUX', 'nul', 'CONIN$', 'conout$', 'COM1', 'com9', 'COM\u00b9', 'com\u00b2', 'LPT\u00b3', 'lpt1', 'nul.txt', 'aux.tar.gz', 'nul .txt'];
    for (const name of devices) expect(onWindows(() => unsafeSegments(`C:\\g\\${name}`))).toBe(true);
    for (const name of ['console', 'com10', 'comx', 'lpt', 'nullable']) expect(onWindows(() => unsafeSegments(`C:\\g\\${name}`))).toBe(false);
  });

  it('applies only on Windows, except for dot dot', () => {
    if (windows) return;
    expect(unsafeSegments('/g/x. /y')).toBe(false);
    expect(unsafeSegments('/g/CONIN$')).toBe(false);
    expect(unsafeSegments('/g/../y')).toBe(true);
  });

  it.runIf(windows)('refuses them for the renderer under a real grant', async () => {
    for (const name of ['x.', 'x ', '...', 'x\uff0e', 'COM\u00b9', 'CONOUT$']) {
      await expect(access.resolve(`${granted}\\sub\\${name}`)).rejects.toThrow(/may not use/);
    }
  });
});

describe('comparing real paths', () => {
  it('is exact, so a different case is a different folder', () => {
    const root = join(base, 'Root');
    expect(pathInside(root, join(base, 'Root', 'x'))).toBe(true);
    expect(pathInside(root, root)).toBe(true);
    expect(pathInside(root, join(base, 'root', 'x'))).toBe(false);
    expect(pathInside(root, join(base, 'Root-evil'))).toBe(false);
    expect(pathInside(root, join(base, 'root', 'x'), pathKey)).toBe(process.platform === 'win32');
  });

  it('keeps the case of the disk through a grant', async () => {
    const real = await access.resolve(join(granted, 'sub', 'in.txt'));
    expect(real).toBe(join(granted, 'sub', 'in.txt'));
    expect(await readFile(real, 'utf8')).toBe('inside');
  });
});

describe('network paths', () => {
  const unc = ['\\\\10.255.255.1\\share\\x.txt', '//10.255.255.1/share/x.txt', '\\/10.255.255.1\\share\\x.txt'];

  it.runIf(windows)('are refused without any file system call when no grant is on a share', async () => {
    const started = Date.now();
    for (const path of unc) await expect(access.resolve(path)).rejects.toThrow(/may not use/);
    await expect(access.list('\\\\10.255.255.1\\share')).rejects.toThrow(/not inside a granted folder/);
    expect(Date.now() - started).toBeLessThan(1500);
  });

  it.runIf(windows)('stay inside the share that was granted', async () => {
    const share = `\\\\localhost\\${base.slice(0, 1)}$${base.slice(2)}\\granted`;
    const shared = createDocumentAccess();
    try {
      shared.allowFolder(share);
    } catch {
      return;
    }
    expect(await readFile(await shared.resolve(`${share}\\sub\\in.txt`), 'utf8')).toBe('inside');
    await expect(shared.resolve(`\\\\localhost\\${base.slice(0, 1)}$\\Windows\\win.ini`)).rejects.toThrow(/may not use/);
    await expect(shared.resolve(unc[0] ?? '')).rejects.toThrow(/may not use/);
    await expect(shared.resolve(join(base, 'outside', 'secret.txt'))).rejects.toThrow(/may not use/);
  });
});

describe('the limits of a listing', () => {
  beforeEach(async () => {
    await mkdir(join(granted, 'files'));
    for (let index = 0; index < 10; index += 1) await writeFile(join(granted, 'files', `f${index}.txt`), 'x');
    await mkdir(join(granted, 'a', 'b', 'c', 'd'), { recursive: true });
  });

  it('stops at the entry cap and says so', async () => {
    const listing = await limited({ entries: 3 }).list(join(granted, 'files'));
    expect(listing.entries.map((entry) => entry.name)).toHaveLength(3);
    expect(listing.truncated).toBe(true);
  });

  it('is whole when the folder fits the cap exactly', async () => {
    for (const entries of [10, 11]) {
      const listing = await limited({ entries }).list(join(granted, 'files'));
      expect(listing.entries).toHaveLength(10);
      expect(listing.truncated).toBe(false);
    }
  });

  it('counts the entries of the whole walk, not of each folder', async () => {
    const listing = await limited({ entries: 12 }).list(granted, { recursive: true });
    expect(listing.truncated).toBe(true);
    expect(listing.entries.length).toBeLessThanOrEqual(12);
  });

  it('stops at the depth cap', async () => {
    const shallow = await limited({ depth: 2 }).list(join(granted, 'a'), { recursive: true });
    expect(shallow.entries.map((entry) => entry.name)).toEqual(['b', 'c']);
    expect(shallow.truncated).toBe(true);
    const deep = await limited({}).list(join(granted, 'a'), { recursive: true });
    expect(deep.entries.map((entry) => entry.name)).toEqual(['b', 'c', 'd']);
    expect(deep.truncated).toBe(false);
  });

  it('stops when the time is up', async () => {
    const listing = await limited({ ms: 0 }).list(granted, { recursive: true });
    expect(listing).toEqual({ entries: [], truncated: true });
  });

  it('is not truncated for a plain level listing', async () => {
    expect((await access.list(granted)).truncated).toBe(false);
  });

  it('stops a running walk once the grant is revoked', async () => {
    const live = vi.fn<() => boolean>().mockReturnValueOnce(true).mockReturnValue(false);
    const settings = { extensions: null, recursive: true };
    await expect(listFolder(granted, settings, LIST_LIMITS, { covers: () => true, live })).rejects.toThrow(/revoked/);
  });
});
