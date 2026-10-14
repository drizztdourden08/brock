/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import { fileGuard } from '../src/main/files/file-guard-state';
import { createNodeFileStore } from '../src/main/files/node-file-store';
import { initPaths } from '../src/main/paths/init-paths';
import { fileHandlers } from '../src/main/handlers/file-handlers';
import { windowHandlers } from '../src/main/window/ipc-handlers';

vi.mock('electron', () => ({ screen: {}, BrowserWindow: { getAllWindows: () => [] } }));

type Handler = (event: unknown, ...args: unknown[]) => unknown;

let root = '';

const registered = (group: { register: (ctx: MainContext) => void }, extra: Partial<MainContext>) => {
  const handlers = new Map<string, Handler>();
  const handle = ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'];
  const ctx = { handle, on: (() => undefined), ...extra } as Partial<MainContext> as MainContext;
  group.register(ctx);
  return (channel: string, ...args: unknown[]): Promise<unknown> => Promise.resolve().then(() => handlers.get(channel)?.({}, ...args));
};

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'brock-guard-'));
  initPaths(root);
});

afterEach(async () => {
  fileGuard.current = null;
  await rm(root, { recursive: true, force: true });
});

describe('the write guard of the base file handlers', () => {
  it('asks the guard before every write and refuses with its reason', async () => {
    const asked: string[] = [];
    fileGuard.current = (request) => {
      asked.push(`${request.kind} ${request.path}`);
      return request.path.startsWith('dataset/') ? 'the dataset is read-only in this build' : true;
    };
    const call = registered(fileHandlers, { files: createNodeFileStore() });
    await call('file:writeText', 'notes/a.txt', 'kept');
    await expect(call('file:writeText', 'dataset/rooms.json', '{}')).rejects.toThrow('The app refused to writeText "dataset/rooms.json": the dataset is read-only in this build');
    await expect(call('file:remove', 'dataset/rooms.json')).rejects.toThrow(/refused to remove/);
    expect(await call('file:readText', 'notes/a.txt')).toBe('kept');
    expect(existsSync(join(root, 'Data', 'dataset'))).toBe(false);
    expect(asked).toEqual(['writeText notes/a.txt', 'writeText dataset/rooms.json', 'remove dataset/rooms.json']);
  });

  it('lets every write through without a guard, and a guard that answers false refuses with no reason', async () => {
    const call = registered(fileHandlers, { files: createNodeFileStore() });
    await call('file:mkdir', 'saves');
    expect(existsSync(join(root, 'Data', 'saves'))).toBe(true);
    fileGuard.current = () => false;
    await expect(call('file:mkdir', 'more')).rejects.toThrow('The app refused to mkdir "more"');
  });
});

describe('FileStore.trash', () => {
  it('hands the full path to the trash and skips a missing file', async () => {
    const trashed: string[] = [];
    const files = createNodeFileStore({ trashItem: (full) => { trashed.push(full); return Promise.resolve(); } });
    await files.writeText('old/save.bin', 'x');
    await files.trash?.('old/save.bin');
    await files.trash?.('old/missing.bin');
    expect(trashed).toEqual([join(root, 'Data', 'old', 'save.bin')]);
    await expect(files.trash?.('../outside.txt')).rejects.toThrow(/escapes/);
  });

  it('is absent without a trash, and the file:trash channel says so', async () => {
    const files = createNodeFileStore();
    expect(files.trash).toBeUndefined();
    const call = registered(fileHandlers, { files });
    await expect(call('file:trash', 'x.txt')).rejects.toThrow('This host has no trash');
  });

  it('goes through the guard', async () => {
    fileGuard.current = ({ kind }) => kind !== 'trash';
    const call = registered(fileHandlers, { files: createNodeFileStore({ trashItem: () => Promise.resolve() }) });
    await expect(call('file:trash', 'x.txt')).rejects.toThrow(/refused to trash/);
  });
});

describe('the audio mute channels', () => {
  it('mute and unmute the app window and read its state back', async () => {
    let muted = false;
    const win = { webContents: { setAudioMuted: (value: boolean) => { muted = value; }, isAudioMuted: () => muted } };
    const call = registered(windowHandlers, { window: () => win as never });
    expect(await call('window:setAudioMuted', true)).toBe(true);
    expect(await call('window:isAudioMuted')).toBe(true);
    expect(await call('window:setAudioMuted', false)).toBe(false);
    const none = registered(windowHandlers, { window: () => null });
    expect(await none('window:isAudioMuted')).toBe(false);
  });
});
