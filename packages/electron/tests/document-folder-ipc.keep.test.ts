/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import type { BrowserWindow } from 'electron';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import type { WatchFn } from '../src/main/documents/watch-folder.type';
import { loose, makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';
import { windowOf } from './window-control';

vi.mock('electron', () => ({ dialog: {}, app: { addRecentDocument: () => undefined, clearRecentDocuments: () => undefined } }));

interface Fake {
  closed: number;
  signal: (kind: 'rename' | 'change', name: string | null) => void;
}

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;
let call: Call;
let fakes: Fake[] = [];
let closers: (() => void)[] = [];
let trashed: string[] = [];
const emit = vi.fn();

const watcher: WatchFn = (_dir, _recursive, onSignal) => {
  const fake: Fake = { closed: 0, signal: onSignal };
  fakes.push(fake);
  return { close: () => { fake.closed += 1; } };
};

const win = loose<BrowserWindow>({ once: (_event: string, fn: () => void) => closers.push(fn) });

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-folder-ipc-'));
  fakes = [];
  closers = [];
  trashed = [];
  emit.mockReset();
  access = testAccess({ watcher, watchMs: 10, trashItem: (path) => Promise.resolve(void trashed.push(path)) });
  access.allowFolder(granted);
  call = sessionOf({ documents: access, emit, window: windowOf(() => win) });
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('the file operations over the document channels', () => {
  it('trash, rename and mkdir work inside the grant and are refused outside it', async () => {
    await call('document:mkdir', join(granted, 'a', 'b'), { recursive: true });
    await writeFile(join(granted, 'a', 'b', 'f.txt'), 'f');
    await call('document:rename', join(granted, 'a', 'b', 'f.txt'), join(granted, 'a', 'g.txt'));
    await call('document:trash', join(granted, 'a', 'g.txt'));
    expect(existsSync(join(granted, 'a', 'b', 'f.txt'))).toBe(false);
    await call('document:trash', join(granted, 'a'));
    expect(trashed).toEqual([join(granted, 'a', 'g.txt'), join(granted, 'a')]);
    await expect(call('document:trash', join(outside, 'secret.txt'))).rejects.toThrow(/granted folder/);
    await expect(call('document:rename', join(granted, 'sub'), join(outside, 'sub'))).rejects.toThrow(/granted folder/);
    await expect(call('document:mkdir', join(outside, 'new'))).rejects.toThrow(/granted folder/);
    await expect(call('document:trash', granted)).rejects.toThrow(/granted folder itself/);
    await expect(call('document:mkdir', join(granted, '.git'))).rejects.toThrow(/may not be changed/);
    await expect(call('document:rename', join(granted, 'sub'), join(granted, '.vscode'))).rejects.toThrow(/may not be changed/);
  });

  it('revokeFolder from the renderer removes the grant and answers whether there was one', async () => {
    expect(await call('document:revokeFolder', granted)).toBe(true);
    expect(await call('document:revokeFolder', granted)).toBe(false);
    await expect(call('document:readText', join(granted, 'sub', 'in.txt'))).rejects.toThrow(/may not use/);
  });
});

describe('the folder watch over the document channels', () => {
  it('sends the events of a watch with its id until it is stopped', async () => {
    await call('document:watch', 'w1', granted, { recursive: true });
    fakes[0]?.signal('change', join('sub', 'in.txt'));
    await vi.waitFor(() => expect(emit).toHaveBeenCalledWith('document:watchEvent', 'w1', { kind: 'change', path: join(granted, 'sub', 'in.txt') }));
    await call('document:unwatch', 'w1');
    await call('document:unwatch', 'w1');
    await call('document:unwatch', 'unknown');
    expect(fakes[0]?.closed).toBe(1);
  });

  it('refuses a bad or duplicate id, and a folder outside, without keeping the id', async () => {
    await expect(call('document:watch', '', granted, {})).rejects.toThrow(/id/);
    await expect(call('document:watch', 'x'.repeat(65), granted, {})).rejects.toThrow(/id/);
    await expect(call('document:watch', 7, granted, {})).rejects.toThrow(/id/);
    await expect(call('document:watch', 'w1', outside, {})).rejects.toThrow(/granted folder/);
    await call('document:watch', 'w1', granted, {});
    await expect(call('document:watch', 'w1', granted, {})).rejects.toThrow(/already exists/);
    expect(fakes).toHaveLength(1);
  });

  it('stops every watch when the window closes, and listens for that once', async () => {
    await call('document:watch', 'w1', granted, {});
    await call('document:watch', 'w2', join(granted, 'sub'), {});
    expect(closers).toHaveLength(1);
    closers[0]?.();
    expect(fakes.map((fake) => fake.closed)).toEqual([1, 1]);
    await call('document:watch', 'w1', granted, {});
    expect(fakes).toHaveLength(3);
  });

  it('stops when the grant is revoked, from main or from the renderer', async () => {
    await call('document:watch', 'w1', granted, {});
    await call('document:revokeFolder', granted);
    expect(fakes[0]?.closed).toBe(1);
    const other = join(base, 'other');
    await mkdir(other);
    access.allowFolder(other);
    await call('document:watch', 'w2', other, {});
    access.revokeFolder(other);
    expect(fakes[1]?.closed).toBe(1);
    fakes[1]?.signal('rename', 'x');
    await new Promise((done) => setTimeout(done, 40));
    expect(emit).not.toHaveBeenCalled();
  });

  it('refuses a watch when there is no window to send to', async () => {
    const none = sessionOf({ documents: access, emit, window: windowOf(() => null) });
    await expect(none('document:watch', 'w1', granted, {})).rejects.toThrow(/no window/);
    expect(fakes).toEqual([]);
  });
});
