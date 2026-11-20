/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { electronClipboard } from '../src/main/clipboard/electron-clipboard';
import { pngOf } from './clipboard-fixture';

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));

const system = vi.hoisted(() => {
  class ClipboardItem {
    readonly types: string[];
    readonly #entries: Record<string, Blob | string>;

    constructor(entries: Record<string, Blob | string>) {
      this.#entries = entries;
      this.types = Object.keys(entries);
    }

    getType = (type: string): Promise<Blob> => {
      const value = this.#entries[type];
      if (value === undefined) return Promise.reject(new Error(`The item has no ${type}`));
      return Promise.resolve(typeof value === 'string' ? new Blob([value], { type }) : value);
    };
  }
  return { ClipboardItem, items: [] as ClipboardItem[], clears: 0, reads: 0 };
});

vi.mock('electron', () => ({
  nativeImage: {},
  ClipboardItem: system.ClipboardItem,
  clipboard: {
    has: (type: string) => Promise.resolve(system.items.some((item) => item.types.includes(type))),
    read: () => {
      system.reads += 1;
      return Promise.resolve(system.items);
    },
    readText: async () => {
      const item = system.items.find((entry) => entry.types.includes('text/plain'));
      return item === undefined ? '' : (await item.getType('text/plain')).text();
    },
    write: (items: InstanceType<typeof system.ClipboardItem>[]) => {
      system.items = items;
      return Promise.resolve();
    },
    clear: () => {
      system.items = [];
      system.clears += 1;
    },
  },
}));

const own = 'application/x-bxel-clip';

const put = (entries: Record<string, Uint8Array | string>): void => {
  const blobs = Object.entries(entries).map(([type, value]): [string, Blob | string] => [type, typeof value === 'string' ? value : new Blob([Uint8Array.from(value)], { type })]);
  system.items = [new system.ClipboardItem(Object.fromEntries(blobs))];
};

beforeEach(() => {
  system.items = [];
  system.clears = 0;
  system.reads = 0;
});

describe('K1 clipboard on the Electron 45 async API', { tags: ['critical'] }, () => {
  it('writes text, a PNG and a private type as one clipboard item and reads them back', async () => {
    const backend = electronClipboard('application/x-bxel-');
    await backend.write({ text: 'hello', png: pngOf(4, 3), privates: [{ type: own, data: Uint8Array.from([1, 2, 3]) }] });
    expect(system.items).toHaveLength(1);
    expect(system.items[0]).toBeInstanceOf(system.ClipboardItem);
    expect(system.items[0]?.types).toEqual(['text/plain', 'image/png', own]);
    expect(await backend.readText()).toBe('hello');
    const image = await backend.readImage();
    expect(image).toMatchObject({ width: 4, height: 3 });
    expect(image?.png()).toEqual(pngOf(4, 3));
    expect(await backend.readBuffer(own)).toEqual(Uint8Array.from([1, 2, 3]));
    expect(await backend.readBuffer('application/x-bxel-none')).toHaveLength(0);
  });

  it('clears the clipboard when there is nothing to write', async () => {
    put({ 'text/plain': 'old' });
    await electronClipboard('application/x-bxel-').write({ privates: [] });
    expect(system.clears).toBe(1);
    expect(system.items).toEqual([]);
  });

  it('reads no image when there is none, and refuses a PNG that is not whole', async () => {
    const backend = electronClipboard('application/x-bxel-');
    put({ 'text/plain': 'x' });
    expect(await backend.readImage()).toBeNull();
    put({ 'image/png': Uint8Array.from([1, 2, 3]) });
    await expect(backend.readImage()).rejects.toThrow(/not a whole PNG/);
  });

  it('changes the fingerprint on new text, a new image and new private bytes, and keeps it otherwise', async () => {
    const backend = electronClipboard('application/x-bxel-');
    const empty = await backend.fingerprint();
    expect(await backend.fingerprint()).toBe(empty);
    put({ 'text/plain': 'hello' });
    const withText = await backend.fingerprint();
    put({ 'text/plain': 'hello', 'image/png': pngOf(4, 3) });
    const withImage = await backend.fingerprint();
    put({ 'text/plain': 'hello', 'image/png': pngOf(4, 3), [own]: Uint8Array.from([9]) });
    const withClip = await backend.fingerprint();
    put({ 'text/plain': 'hello', 'image/png': pngOf(4, 3), [own]: Uint8Array.from([8]) });
    const otherClip = await backend.fingerprint();
    expect(new Set([empty, withText, withImage, withClip, otherClip]).size).toBe(5);
  });
});
