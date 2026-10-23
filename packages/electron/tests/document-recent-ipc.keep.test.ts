/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { BrowserWindow } from 'electron';
import type { MainContext } from '../src/main/types/main-context.type';
import { createDocumentAccess } from '../src/main/documents/document-access';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { documentHandlers } from '../src/main/documents/ipc-handlers';

const electron = vi.hoisted(() => ({
  open: vi.fn<(win: unknown, options: unknown) => Promise<{ canceled: boolean; filePaths: string[] }>>(),
  addRecent: vi.fn<(path: string) => void>(),
  clearRecent: vi.fn<() => void>(),
}));

vi.mock('electron', () => ({
  dialog: { showOpenDialog: electron.open, showSaveDialog: vi.fn() },
  app: { addRecentDocument: electron.addRecent, clearRecentDocuments: electron.clearRecent },
}));

type Handler = (event: unknown, ...args: unknown[]) => unknown;
type Call = (channel: string, ...args: unknown[]) => Promise<unknown>;

let dir = '';
let call: Call;
const log = vi.fn();

const bytes = (...values: number[]): ArrayBuffer => new Uint8Array(values).buffer;
const make = async (name: string, text = name): Promise<string> => {
  const path = join(dir, name);
  await writeFile(path, text);
  return path;
};
const openDialog = async (path: string): Promise<void> => {
  electron.open.mockResolvedValue({ canceled: false, filePaths: [path] });
  await call('document:open', undefined, 'p1');
};

const session = (documents: DocumentAccess): Call => {
  const handlers = new Map<string, Handler>();
  const ctx: Partial<MainContext> = {
    handle: ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'],
    documents,
    window: () => ({}) as BrowserWindow,
    paths: { userData: (...segments) => join(dir, ...segments), data: (...segments) => join(dir, 'Data', ...segments) },
    log,
  };
  documentHandlers.register(ctx as MainContext);
  return (channel, ...args) => Promise.resolve().then(() => handlers.get(channel)?.({}, ...args));
};

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brock-recent-ipc-'));
  call = session(createDocumentAccess());
  electron.open.mockReset();
  electron.addRecent.mockReset();
  electron.clearRecent.mockReset();
  log.mockReset();
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('recent documents over IPC', () => {
  it('records a file picked in the open dialog, and tells the OS', async () => {
    const picked = await make('a.bxel');
    await openDialog(picked);
    expect(await call('document:recent', 'p1')).toMatchObject([{ path: picked, name: 'a.bxel' }]);
    expect(electron.addRecent).toHaveBeenCalledWith(picked);
  });

  it('records nothing without a profile, and the open still works', async () => {
    const picked = await make('a.bxel');
    electron.open.mockResolvedValue({ canceled: false, filePaths: [picked] });
    expect(await call('document:open')).toBe(picked);
    expect(await call('document:recent', 'p1')).toEqual([]);
    expect(electron.addRecent).not.toHaveBeenCalled();
  });

  it('records a save, and a save with no profile leaves the list alone', async () => {
    const picked = await make('a.bxel');
    await openDialog(picked);
    await call('document:write', picked, bytes(1), 'p2');
    await call('document:writeText', picked, 'text');
    expect(await call('document:recent', 'p2')).toMatchObject([{ path: picked }]);
    expect(await call('document:recent', 'p3')).toEqual([]);
  });

  it('skips the recent list and the recovery snapshots when the write says recent is false', async () => {
    const picked = await make('a.bxel');
    await openDialog(picked);
    await call('document:snapshot', 'p2', { key: 'doc-1', data: bytes(1), path: picked });
    await call('document:write', picked, bytes(1), 'p2', { recent: false });
    await call('document:writeText', picked, 'text', 'p2', { recent: false });
    expect(await call('document:recent', 'p2')).toEqual([]);
    expect(await call('document:recoverable', 'p2')).toHaveLength(1);
    expect(electron.addRecent).toHaveBeenCalledTimes(1);
    await call('document:writeText', picked, 'text', 'p2', { recent: true });
    expect(await call('document:recent', 'p2')).toMatchObject([{ path: picked }]);
    await call('document:write', picked, bytes(2), 'p3', {});
    expect(await call('document:recent', 'p3')).toMatchObject([{ path: picked }]);
  });

  it('reopens a recent file through the allowlist in a new session', async () => {
    const picked = await make('a.bxel', 'doc a');
    await openDialog(picked);
    const second = session(createDocumentAccess());
    await expect(second('document:readText', picked)).rejects.toThrow(/may not use/);
    expect(await second('document:openRecent', 'p1', picked)).toBe(picked);
    expect(await second('document:readText', picked)).toBe('doc a');
  });

  it('refuses to open a path the list does not hold, and a missing recent file answers null', async () => {
    const stranger = await make('stranger.bxel');
    await expect(call('document:openRecent', 'p1', stranger)).rejects.toThrow(/not in the recent documents list/);
    await expect(call('document:readText', stranger)).rejects.toThrow(/may not use/);
    const gone = await make('gone.bxel');
    await openDialog(gone);
    await rm(gone);
    expect(await call('document:openRecent', 'p1', gone)).toBeNull();
    expect(await call('document:recent', 'p1')).toEqual([]);
  });

  it('clears the list', async () => {
    await openDialog(await make('a.bxel'));
    await call('document:clearRecent', 'p1');
    expect(await call('document:recent', 'p1')).toEqual([]);
    expect(electron.clearRecent).toHaveBeenCalledTimes(1);
  });

  it('refuses a profile id that could leave the profiles folder', async () => {
    await expect(call('document:recent', '../x')).rejects.toThrow(/Unsafe profile id/);
    await expect(call('document:recent')).rejects.toThrow(/needs a profile id/);
  });
});

describe('recovery snapshots over IPC', () => {
  it('saves a snapshot, lists it, restores the bytes and discards it', async () => {
    await call('document:snapshot', 'p1', { key: 'doc-1', data: bytes(5, 6), name: 'sprite', path: join(dir, 'sprite.bxel') });
    expect(await call('document:recoverable', 'p1')).toMatchObject([{ key: 'doc-1', name: 'sprite', size: 2 }]);
    expect([...new Uint8Array(await call('document:restoreSnapshot', 'p1', 'doc-1') as ArrayBuffer)]).toEqual([5, 6]);
    await call('document:discardSnapshot', 'p1', 'doc-1');
    expect(await call('document:recoverable', 'p1')).toEqual([]);
    expect(await call('document:restoreSnapshot', 'p1', 'doc-1')).toBeNull();
  });

  it('clears the snapshots of a path on a clean save to it', async () => {
    const picked = await make('a.bxel');
    await openDialog(picked);
    await call('document:snapshot', 'p1', { key: 'doc-1', data: bytes(1), path: picked });
    await call('document:snapshot', 'p1', { key: 'doc-2', data: bytes(2), path: join(dir, 'other.bxel') });
    await call('document:write', picked, bytes(7), 'p1');
    expect(((await call('document:recoverable', 'p1')) as { key: string }[]).map((entry) => entry.key)).toEqual(['doc-2']);
  });

  it('keeps a snapshot when the save carries no profile', async () => {
    const picked = await make('a.bxel');
    await openDialog(picked);
    await call('document:snapshot', 'p1', { key: 'doc-1', data: bytes(1), path: picked });
    await call('document:write', picked, bytes(7));
    expect(await call('document:recoverable', 'p1')).toHaveLength(1);
  });

  it('refuses a snapshot that is not bytes, or a key that is not a name', async () => {
    await expect(call('document:snapshot', 'p1', { key: 'doc-1', data: 'text' })).rejects.toThrow(/needs bytes/);
    await expect(call('document:snapshot', 'p1', { key: '../doc', data: bytes(1) })).rejects.toThrow(/Unsafe snapshot key/);
    await expect(call('document:snapshot', 'p1', { key: 5, data: bytes(1) })).rejects.toThrow(/Unsafe snapshot key/);
  });
});
