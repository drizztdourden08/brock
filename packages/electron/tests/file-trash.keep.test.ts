/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createNodeFileStore } from '../src/main/files/node-file-store';
import { userDataRoot } from '../src/main/paths/user-data-root';

const trashed = vi.hoisted(() => [] as string[]);

vi.mock('electron', () => ({
  shell: { trashItem: (path: string) => { trashed.push(path); return Promise.resolve(); } },
}));

let root = '';
let before = '';

beforeEach(async () => {
  trashed.length = 0;
  before = userDataRoot.path;
  root = await mkdtemp(join(tmpdir(), 'brock-trash-'));
  userDataRoot.path = root;
  await mkdir(join(root, 'Data', 'packs'), { recursive: true });
  await writeFile(join(root, 'Data', 'packs', 'one.json'), '{}');
});

afterEach(async () => {
  userDataRoot.path = before;
  await rm(root, { recursive: true, force: true });
});

describe('FileStore.trash', () => {
  it('moves a path under Data to the system trash and skips one that is not there', async () => {
    const files = createNodeFileStore();
    await files.trash?.('packs/one.json');
    await files.trash?.('packs/missing.json');
    expect(trashed).toEqual([join(root, 'Data', 'packs', 'one.json')]);
    await expect(files.trash?.('../outside.json')).rejects.toThrow(/escapes/);
  });
});
