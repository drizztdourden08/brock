/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readdir, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createNodeFileStore } from '../src/main/files/node-file-store';
import { initPaths } from '../src/main/paths/init-paths';

let root = '';

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'brock-store-'));
  initPaths(root);
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('K5 the node file store writes', { tags: ['critical'] }, () => {
  it('keeps overlapping JSON writes whole, last call wins, no temp file left', async () => {
    const files = createNodeFileStore();
    const first = JSON.stringify({ writer: 'first', pad: 'x'.repeat(200000) });
    const second = JSON.stringify({ writer: 'second' });
    await Promise.all([files.writeText('config.json', first), files.writeText('config.json', second)]);
    expect(JSON.parse(await readFile(join(root, 'config.json'), 'utf8'))).toEqual({ writer: 'second' });
    expect(await readdir(root)).toEqual(['config.json']);
  });

  it('writes bytes into a new folder the same way', async () => {
    const files = createNodeFileStore();
    await files.writeBytes('deep/blob.bin', new Uint8Array([4, 5, 6]));
    expect([...(await readFile(join(root, 'deep', 'blob.bin')))]).toEqual([4, 5, 6]);
    expect(await readdir(join(root, 'deep'))).toEqual(['blob.bin']);
  });
});
