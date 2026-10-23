/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createDocumentAccess } from '../src/main/documents/document-access';
import { pathExists } from '../src/main/documents/path-exists';
import { createRecentDocuments } from '../src/main/documents/recent-documents';
import { MAX_RECENT_DOCUMENTS } from '../src/main/documents/recent-documents.constants';

let dir = '';
let tick = 0;
const os = { add: vi.fn<(path: string) => void>(), clear: vi.fn<() => void>() };

const setup = () => {
  const access = createDocumentAccess();
  const recent = createRecentDocuments({
    profileDir: (id) => join(dir, 'profiles', id),
    exists: pathExists,
    allow: access.allow,
    os,
    now: () => ++tick,
  });
  return { access, recent };
};

const make = async (name: string): Promise<string> => {
  const path = join(dir, name);
  await writeFile(path, name);
  return path;
};

const seeded = async () => {
  const { access, recent } = setup();
  const a = await make('a.bxel');
  const b = await make('b.bxel');
  await recent.record('p1', a);
  await recent.record('p1', b);
  return { access, recent, a, b };
};

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brock-recent-'));
  tick = 0;
  os.add.mockReset();
  os.clear.mockReset();
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('the recent documents list', () => {
  it('lists the newest first with the name and the last opened time', async () => {
    const { recent, a, b } = await seeded();
    expect(await recent.list('p1')).toEqual([
      { path: b, name: 'b.bxel', lastOpened: 2 },
      { path: a, name: 'a.bxel', lastOpened: 1 },
    ]);
  });

  it('keeps one entry per path and moves a reopened file to the top', async () => {
    const { recent, a } = await seeded();
    await recent.record('p1', a);
    expect((await recent.list('p1')).map((entry) => entry.name)).toEqual(['a.bxel', 'b.bxel']);
  });

  it('caps the list and drops the oldest', async () => {
    const { recent } = setup();
    const paths: string[] = [];
    for (let index = 0; index < MAX_RECENT_DOCUMENTS + 3; index += 1) paths.push(await make(`doc-${index}.bxel`));
    for (const path of paths) await recent.record('p1', path);
    const listed = await recent.list('p1');
    expect(listed).toHaveLength(MAX_RECENT_DOCUMENTS);
    expect(listed[0]?.path).toBe(paths[paths.length - 1]);
    expect(listed.some((entry) => entry.path === paths[0])).toBe(false);
  });
});

describe('the recent documents list on disk', () => {
  it('keeps a list per profile', async () => {
    const { recent } = setup();
    await recent.record('p1', await make('a.bxel'));
    expect(await recent.list('p2')).toEqual([]);
  });

  it('drops a file that no longer exists, and writes the list back without it', async () => {
    const { recent, a } = await seeded();
    await rm(a);
    expect((await recent.list('p1')).map((entry) => entry.name)).toEqual(['b.bxel']);
    const stored = JSON.parse(await readFile(join(dir, 'profiles', 'p1', 'recent-documents.json'), 'utf8')) as unknown[];
    expect(stored).toHaveLength(1);
  });

  it('reads a damaged list as empty', async () => {
    const { recent } = setup();
    await recent.record('p1', await make('a.bxel'));
    await writeFile(join(dir, 'profiles', 'p1', 'recent-documents.json'), '{not json');
    expect(await recent.list('p1')).toEqual([]);
  });

  it('clears the list and the OS recent menu', async () => {
    const { recent } = setup();
    await recent.record('p1', await make('a.bxel'));
    await recent.clear('p1');
    expect(await recent.list('p1')).toEqual([]);
    expect(os.clear).toHaveBeenCalledTimes(1);
  });

  it('tells the OS about each recorded path for the jump list and the Dock', async () => {
    const { recent } = setup();
    const a = await make('a.bxel');
    await recent.record('p1', a);
    expect(os.add).toHaveBeenCalledWith(a);
  });
});

describe('reopening a recent document', () => {
  it('allows the path in main only after the check, and moves it to the top', async () => {
    const { access, recent, a, b } = await seeded();
    expect(access.isAllowed(a)).toBe(false);
    expect(await recent.reopen('p1', a)).toBe(a);
    expect(access.isAllowed(a)).toBe(true);
    expect(access.isAllowed(b)).toBe(false);
    expect((await recent.list('p1'))[0]?.path).toBe(a);
  });

  it('answers null and forgets the entry when the file is gone, allowing nothing', async () => {
    const { access, recent } = setup();
    const a = await make('a.bxel');
    await recent.record('p1', a);
    await rm(a);
    expect(await recent.reopen('p1', a)).toBeNull();
    expect(access.isAllowed(a)).toBe(false);
    expect(await recent.list('p1')).toEqual([]);
  });

  it('refuses a path that is not in the list, even when it exists', async () => {
    const { access, recent } = setup();
    const stranger = await make('stranger.bxel');
    await expect(recent.reopen('p1', stranger)).rejects.toThrow(/not in the recent documents list/);
    expect(access.isAllowed(stranger)).toBe(false);
  });
});
