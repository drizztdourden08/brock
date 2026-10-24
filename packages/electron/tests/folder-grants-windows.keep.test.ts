/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { execSync } from 'child_process';
import { readFile, rm } from 'fs/promises';
import { join } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import { makeTree, refusedBy } from './folder-fixture';

let base = '';
let granted = '';
let outside = '';
let access = createDocumentAccess();

const shortNameOf = (path: string): string => execSync(`for %I in ("${path}") do @echo %~sI`).toString().trim();

const hasShortNames = (): boolean => shortNameOf(granted).toLowerCase() !== granted.toLowerCase();

const refused = (path: string): Promise<void> => refusedBy(access)(path);

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-grants-win-'));
  access = createDocumentAccess();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe.runIf(process.platform === 'win32')('a folder grant on Windows', () => {
  beforeEach(() => {
    access.allowFolder(granted);
  });

  it('refuses raw prefixes, streams and device names', async () => {
    await refused(`\\\\?\\${join(granted, 'sub', 'in.txt')}`);
    await refused(`\\\\.\\${join(granted, 'sub', 'in.txt')}`);
    await refused(`${join(granted, 'sub', 'in.txt')}:hidden`);
    await refused(`${join(granted, 'sub', 'in.txt')}::$DATA`);
    await refused(join(granted, 'NUL'));
    await refused(join(granted, 'sub', 'con.txt'));
    await refused(join(granted, 'COM1'));
  });

  it('refuses a drive relative path and a drive that is not there', async () => {
    await expect(access.resolve('C:sub\\in.txt')).rejects.toThrow(/absolute path/);
    await refused('Z:\\nowhere\\file.txt');
  });

  it('matches the case on disk in any spelling', async () => {
    expect(await access.resolve(join(granted, 'SUB', 'IN.TXT'))).toBe(join(granted, 'sub', 'in.txt'));
    expect(await access.resolve(join(base, 'GRANTED', 'sub', 'New.TXT'))).toBe(join(granted, 'sub', 'New.TXT'));
    await refused(join(base, 'OUTSIDE', 'secret.txt'));
  });

  it('treats a short 8.3 name as the same folder, never as another', async () => {
    if (!hasShortNames()) return;
    expect(await readFile(await access.resolve(join(shortNameOf(granted), 'sub', 'in.txt')), 'utf8')).toBe('inside');
    await refused(join(shortNameOf(outside), 'secret.txt'));
    await refused(join(shortNameOf(granted), '..', 'outside', 'secret.txt'));
  });

  it('grants through a short name and answers the long one', async () => {
    if (!hasShortNames()) return;
    access.revokeFolder(granted);
    expect(access.allowFolder(shortNameOf(granted))).toBe(granted);
    expect(await access.resolve(join(granted, 'sub', 'in.txt'))).toBe(join(granted, 'sub', 'in.txt'));
    expect(access.revokeFolder(shortNameOf(granted))).toBe(true);
    await refused(join(granted, 'sub', 'in.txt'));
  });
});
