/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, stat } from 'fs/promises';
import { join } from 'path';
import { createSigningKey } from '../src/main/documents/signing-key';
import { PRIVATE_FILE_MODE } from '../src/main/storage/storage.constants';
import { syncedWriter } from '../src/main/storage/synced-writer';
import { writePrivate } from '../src/main/storage/write-private';
import { makeBase } from './folder-fixture';

let dir = '';

beforeEach(async () => {
  dir = await makeBase('brock-private-');
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('private files', () => {
  it('open the temp file with the owner-only mode, and an ordinary write with none', async () => {
    const handle = { writeFile: vi.fn(() => Promise.resolve()), sync: vi.fn(() => Promise.resolve()), close: vi.fn(() => Promise.resolve()) };
    const open = vi.fn(() => Promise.resolve(handle));
    await syncedWriter(PRIVATE_FILE_MODE, open)('f', 'x');
    await syncedWriter(undefined, open)('g', 'x');
    expect(open.mock.calls).toEqual([['f', 'w', 0o600], ['g', 'w', undefined]]);
    expect(handle.close).toHaveBeenCalledTimes(2);
    expect(PRIVATE_FILE_MODE).toBe(0o600);
    expect(handle.sync).toHaveBeenCalledTimes(2);
  });

  it.runIf(process.platform !== 'win32')('are written with mode 600: the signing key and any private write', async () => {
    const keyFile = join(dir, 'keys', 'recent-signing.key');
    await createSigningKey(() => keyFile)();
    await writePrivate(join(dir, 'remembered-folders.json'), '[]');
    expect((await stat(keyFile)).mode & 0o777).toBe(0o600);
    expect((await stat(join(dir, 'remembered-folders.json'))).mode & 0o777).toBe(0o600);
  });

  it('still replace the file whole and keep the content', async () => {
    const file = join(dir, 'a.json');
    await writePrivate(file, '[1]');
    await writePrivate(file, '[2]');
    expect((await stat(file)).size).toBe(3);
  });
});
