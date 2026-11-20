/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { electronClipboard } from '../src/main/clipboard/electron-clipboard';
import { pngOf } from './clipboard-fixture';

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));

const system = vi.hoisted(() => ({
  formats: [] as string[],
  text: '',
  buffers: new Map<string, Buffer>(),
  readImage: vi.fn(),
}));

vi.mock('electron', () => ({
  clipboard: {
    availableFormats: () => system.formats,
    readText: () => system.text,
    readBuffer: (format: string) => system.buffers.get(format) ?? Buffer.alloc(0),
    readImage: system.readImage,
    write: vi.fn(),
    writeBuffer: vi.fn(),
    clear: vi.fn(),
  },
  nativeImage: { createFromBuffer: vi.fn() },
}));

const decoded = (width: number, height: number) => ({ isEmpty: () => false, getSize: () => ({ width, height }), toPNG: () => Buffer.from([1]), toBitmap: () => Buffer.alloc(4) });

beforeEach(() => {
  system.formats = [];
  system.text = '';
  system.buffers.clear();
  system.readImage.mockReset();
  system.readImage.mockReturnValue(decoded(2, 2));
});

describe('K1 clipboard image read', { tags: ['critical'] }, () => {
  it('reads a PNG from its own bytes without decoding it', async () => {
    system.formats = ['image/png'];
    system.buffers.set('image/png', Buffer.from(pngOf(4, 3)));
    const image = await electronClipboard('application/x-bxel-').readImage();
    expect(image).toMatchObject({ width: 4, height: 3 });
    expect(image?.png()).toEqual(Buffer.from(pngOf(4, 3)));
    expect(system.readImage).not.toHaveBeenCalled();
  });

  it('refuses a PNG over the size cap from its header, before any decode', async () => {
    system.formats = ['image/png'];
    for (const bytes of [pngOf(20000, 2), pngOf(9000, 9000), pngOf(0, 2), Uint8Array.from([1, 2, 3])]) {
      system.buffers.set('image/png', Buffer.from(bytes));
      await expect(electronClipboard('application/x-bxel-').readImage()).rejects.toThrow(/not a whole PNG/);
    }
    expect(system.readImage).not.toHaveBeenCalled();
  });

  it('falls back to a decode only when the system gives no PNG bytes', async () => {
    system.formats = ['image/bmp'];
    const image = await electronClipboard('application/x-bxel-').readImage();
    expect(image).toMatchObject({ width: 2, height: 2 });
    expect(system.readImage).toHaveBeenCalledTimes(1);
  });

  it('reads nothing and decodes nothing when there is no image format', async () => {
    system.formats = ['text/plain'];
    expect(await electronClipboard('application/x-bxel-').readImage()).toBeNull();
    expect(system.readImage).not.toHaveBeenCalled();
  });
});

describe('K1 clipboard fingerprint', { tags: ['critical'] }, () => {
  it('never decodes an image when the system gives PNG bytes', async () => {
    system.formats = ['image/png'];
    system.buffers.set('image/png', Buffer.from(pngOf(4, 3)));
    const backend = electronClipboard('application/x-bxel-');
    const first = await backend.fingerprint();
    for (let poll = 0; poll < 12; poll += 1) await backend.fingerprint();
    expect(system.readImage).not.toHaveBeenCalled();
    system.buffers.set('image/png', Buffer.from(pngOf(5, 5)));
    for (let poll = 0; poll < 4; poll += 1) await backend.fingerprint();
    expect(await backend.fingerprint()).not.toBe(first);
  });

  it('decodes at most once in a few polls when the system gives no PNG bytes', async () => {
    system.formats = ['image/bmp'];
    const backend = electronClipboard('application/x-bxel-');
    for (let poll = 0; poll < 8; poll += 1) await backend.fingerprint();
    expect(system.readImage.mock.calls.length).toBeLessThanOrEqual(3);
  });

  it('notices new text and a new private type without touching the image', async () => {
    const backend = electronClipboard('application/x-bxel-');
    const empty = await backend.fingerprint();
    system.text = 'hello';
    const withText = await backend.fingerprint();
    system.formats = ['application/x-bxel-clip'];
    system.buffers.set('application/x-bxel-clip', Buffer.from([9]));
    const withClip = await backend.fingerprint();
    expect(new Set([empty, withText, withClip]).size).toBe(3);
    expect(system.readImage).not.toHaveBeenCalled();
  });
});
