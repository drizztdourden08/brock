/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { AtomicFileOps } from '../src/main/storage/write-atomic.type';
import { atomicFileOps } from '../src/main/storage/atomic-file-ops';
import { writeAtomic } from '../src/main/storage/write-atomic';

let dir = '';
let target = '';

const failing = (code: string): NodeJS.ErrnoException => Object.assign(new Error(code), { code });

const noWait = (over: Partial<AtomicFileOps>): AtomicFileOps => ({ ...atomicFileOps, pause: () => Promise.resolve(), ...over });

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brock-atomic-'));
  target = join(dir, 'sprite.bxel');
  await writeFile(target, 'old document');
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('writeAtomic', () => {
  it('replaces an existing file and leaves no temp file behind', async () => {
    await writeAtomic(target, new Uint8Array([1, 2, 3]));
    expect([...(await readFile(target))]).toEqual([1, 2, 3]);
    expect(await readdir(dir)).toEqual(['sprite.bxel']);
  });

  it('creates a missing file and its folder', async () => {
    const fresh = join(dir, 'nested', 'new.bxel');
    await writeAtomic(fresh, 'text');
    expect(await readFile(fresh, 'utf8')).toBe('text');
  });

  it('keeps the old document when the write dies half way', async () => {
    const dies = noWait({
      writeSynced: async (file, data) => {
        await writeFile(file, String(data).slice(0, 3));
        throw failing('ENOSPC');
      },
    });
    await expect(writeAtomic(target, 'a new, longer document', dies)).rejects.toThrow('ENOSPC');
    expect(await readFile(target, 'utf8')).toBe('old document');
    expect(await readdir(dir)).toEqual(['sprite.bxel']);
  });

  it('keeps the old document when the rename fails', async () => {
    const dies = noWait({ rename: () => Promise.reject(failing('EXDEV')) });
    await expect(writeAtomic(target, 'new', dies)).rejects.toThrow('EXDEV');
    expect(await readFile(target, 'utf8')).toBe('old document');
    expect(await readdir(dir)).toEqual(['sprite.bxel']);
  });

});

describe('writeAtomic on a busy target', () => {
  it('retries a rename that Windows refuses while the target is busy', async () => {
    let refused = 0;
    const busy = noWait({
      rename: async (from, to) => {
        if (refused < 2) {
          refused += 1;
          throw failing('EPERM');
        }
        await atomicFileOps.rename(from, to);
      },
    });
    await writeAtomic(target, 'new', busy);
    expect(refused).toBe(2);
    expect(await readFile(target, 'utf8')).toBe('new');
    expect(await readdir(dir)).toEqual(['sprite.bxel']);
  });

  it('gives up on a target that stays busy and keeps the old document', async () => {
    let tries = 0;
    const stuck = noWait({
      rename: () => {
        tries += 1;
        return Promise.reject(failing('EBUSY'));
      },
    });
    await expect(writeAtomic(target, 'new', stuck)).rejects.toThrow('EBUSY');
    expect(tries).toBeGreaterThan(1);
    expect(await readFile(target, 'utf8')).toBe('old document');
    expect(await readdir(dir)).toEqual(['sprite.bxel']);
  });

  it('runs overlapping writes to one path in order', async () => {
    await Promise.all([writeAtomic(target, 'first'), writeAtomic(target, 'second'), writeAtomic(target, 'third')]);
    expect(await readFile(target, 'utf8')).toBe('third');
  });
});
