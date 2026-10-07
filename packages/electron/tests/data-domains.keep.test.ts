/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readdir, readFile, rm, utimes, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createDataDomains } from '../src/main/storage/create-data-domains';
import { cleanDir } from '../src/main/storage/clean-dir';
import type { DataDomains } from '../src/main/storage/domain-files.type';

let root = '';
let domains: DataDomains;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'brock-domains-'));
  domains = createDataDomains([
    { domain: 'sessions', label: 'Sessions', dir: 'sessions', cleanOlderThanDays: [30] },
    { domain: 'cache', label: 'Cache', dir: 'cache/catalog' },
  ], (dir) => join(root, dir));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('createDataDomains', () => {
  it('reads and writes JSON, text and bytes inside the domain folder', async () => {
    const sessions = domains.domain('sessions');
    expect(await sessions.readJson('runs/one.json', null)).toBeNull();
    await sessions.writeJson('runs/one.json', { seed: 7 });
    expect(await sessions.readJson('runs/one.json', null)).toEqual({ seed: 7 });
    expect(JSON.parse(await readFile(join(root, 'sessions', 'runs', 'one.json'), 'utf8'))).toEqual({ seed: 7 });
    await sessions.writeBytes('runs/out.bin', new Uint8Array([1, 2, 3]));
    expect([...(await sessions.readBytes('runs/out.bin')) ?? []]).toEqual([1, 2, 3]);
    await sessions.writeText('notes.txt', 'hello');
    expect(await sessions.readText('notes.txt')).toBe('hello');
    expect(await sessions.exists('notes.txt')).toBe(true);
  });

  it('refuses paths that leave the domain, absolute paths and the folder itself as a file', async () => {
    const sessions = domains.domain('sessions');
    await expect(sessions.writeJson('../cache/x.json', 1)).rejects.toThrow(/escapes its domain/);
    await expect(sessions.readJson(join(root, 'x.json'), null)).rejects.toThrow(/relative/);
    await expect(sessions.writeText('', 'x')).rejects.toThrow(/path inside the domain/);
    const inRoot = (dir: string): string => join(root, dir);
    expect(() => createDataDomains([{ domain: 'bad', label: 'Bad', dir: '../outside' }], inRoot)).toThrow(/escapes/);
    expect(() => createDataDomains([{ domain: 'a', label: 'A', dir: 'a' }, { domain: 'a', label: 'A', dir: 'b' }], inRoot)).toThrow(/twice/);
    expect(() => domains.domain('missing')).toThrow(/unknown data domain/);
  });

  it('lists entries with sizes, sums sizes and removes files', async () => {
    const sessions = domains.domain('sessions');
    await sessions.writeText('a/one.txt', '12345');
    await sessions.writeText('a/two.txt', '123');
    await sessions.writeText('b.txt', '1');
    const listed = await sessions.list();
    expect(listed.map((entry) => [entry.name, entry.isDirectory, entry.bytes])).toEqual([['a', true, 8], ['b.txt', false, 1]]);
    expect(await sessions.size()).toBe(9);
    expect(await sessions.size('a')).toBe(8);
    await sessions.remove('a');
    expect(await sessions.size()).toBe(1);
    expect(await domains.usage('sessions')).toEqual({ domain: 'sessions', label: 'Sessions', count: 1, bytes: 1 });
    expect(await domains.usage('cache')).toEqual({ domain: 'cache', label: 'Cache', count: 0, bytes: 0 });
  });

  it('keeps the last of many writes to one file at once, with no temp file left', async () => {
    const sessions = domains.domain('sessions');
    const writes = Array.from({ length: 24 }, (_, index) => (index % 2 === 0
      ? sessions.writeJson('state.json', { index })
      : sessions.writeText('state.json', JSON.stringify({ index }))));
    await Promise.all(writes);
    expect(await sessions.readJson('state.json', null)).toEqual({ index: 23 });
    expect(await readdir(join(root, 'sessions'))).toEqual(['state.json']);
  });

  it('lets one failed write leave the next write to the same file working', async () => {
    const sessions = domains.domain('sessions');
    await mkdir(join(root, 'sessions', 'taken.json', 'inside'), { recursive: true });
    const failed = sessions.writeText('taken.json', 'x');
    const after = sessions.writeText('free.json', 'y');
    await expect(failed).rejects.toThrow();
    await after;
    await rm(join(root, 'sessions', 'taken.json'), { recursive: true });
    await sessions.writeText('taken.json', 'z');
    expect(await sessions.readText('taken.json')).toBe('z');
    expect((await readdir(join(root, 'sessions'))).sort()).toEqual(['free.json', 'taken.json']);
  });
});

describe('cleanDir', () => {
  it('removes top-level entries older than the cutoff, judged by their newest file', async () => {
    const dir = join(root, 'sessions');
    await mkdir(join(dir, 'old-run'), { recursive: true });
    await mkdir(join(dir, 'busy-run'), { recursive: true });
    await writeFile(join(dir, 'old-run', 'log.txt'), 'old.');
    await writeFile(join(dir, 'busy-run', 'old.txt'), 'x');
    await writeFile(join(dir, 'busy-run', 'new.txt'), 'y');
    const longAgo = new Date(Date.now() - 40 * 86_400_000);
    for (const file of [join(dir, 'old-run', 'log.txt'), join(dir, 'old-run'), join(dir, 'busy-run', 'old.txt'), join(dir, 'busy-run')]) await utimes(file, longAgo, longAgo);
    expect(await cleanDir(dir, 30 * 86_400_000)).toEqual({ removed: 1, bytes: 4 });
    expect((await domains.domain('sessions').list()).map((entry) => entry.name)).toEqual(['busy-run']);
    expect(await cleanDir(dir, null)).toEqual({ removed: 1, bytes: 2 });
    expect(await cleanDir(join(root, 'nowhere'), null)).toEqual({ removed: 0, bytes: 0 });
  });
});
