/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElectronFactory } from '../src/platform/hosts/electron-factory';
import { dragOut } from '../src/host/drag-out';

const stubApi = () => {
  const listeners: (() => void)[] = [];
  const api = {
    os: 'win32',
    isDev: false,
    clipboardReadText: vi.fn(() => Promise.resolve('hex')),
    clipboardWrite: vi.fn((_entries: Record<string, string | ArrayBuffer>) => Promise.resolve()),
    clipboardRead: vi.fn((_types: string[]) => Promise.resolve<Record<string, string | ArrayBuffer>>({ 'text/plain': 'a', 'image/png': new Uint8Array([1, 2]).buffer })),
    clipboardWatch: vi.fn((_id: string) => Promise.resolve()),
    clipboardUnwatch: vi.fn((_id: string) => Promise.resolve()),
    onClipboardChange: vi.fn((listener: () => void) => {
      listeners.push(listener);
      return () => listeners.splice(listeners.indexOf(listener), 1);
    }),
    netRead: vi.fn((_url: string, _options?: unknown) => Promise.resolve({ bytes: new Uint8Array([7]).buffer, contentType: 'application/json', url: 'https://lospec.com/x' })),
    dragOut: vi.fn((_paths: string[]) => Promise.resolve()),
  };
  vi.stubGlobal('window', { api });
  return Object.assign(api, { listeners });
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('clipboard port', () => {
  it('sends bytes as array buffers and gives bytes back', async () => {
    const api = stubApi();
    const clipboard = createElectronFactory().ports.clipboard?.();
    if (!clipboard) throw new Error('the Electron host has no clipboard port');
    await clipboard.write({ 'text/plain': 'x', 'application/x-bxel-clip': new Uint8Array([5, 6]) });
    const sent = api.clipboardWrite.mock.calls[0]?.[0] ?? {};
    expect(sent['text/plain']).toBe('x');
    expect(new Uint8Array(sent['application/x-bxel-clip'] as ArrayBuffer)).toEqual(new Uint8Array([5, 6]));
    expect(await clipboard.read(['text/plain', 'image/png'])).toEqual({ 'text/plain': 'a', 'image/png': new Uint8Array([1, 2]) });
    expect(await clipboard.readText()).toBe('hex');
  });

  it('subscribes main only while a listener is open and tells it with no content', () => {
    const api = stubApi();
    const clipboard = createElectronFactory().ports.clipboard?.();
    if (!clipboard) throw new Error('the Electron host has no clipboard port');
    const seen = vi.fn();
    const stop = clipboard.onChange(seen);
    expect(api.clipboardWatch).toHaveBeenCalledTimes(1);
    api.listeners.forEach((listener) => listener());
    expect(seen).toHaveBeenCalledWith();
    stop();
    stop();
    expect(api.clipboardUnwatch).toHaveBeenCalledTimes(1);
    expect(api.clipboardUnwatch.mock.calls[0]?.[0]).toBe(api.clipboardWatch.mock.calls[0]?.[0]);
    expect(api.listeners).toEqual([]);
  });
});

describe('net port and drag out', () => {
  it('returns bytes from net.read', async () => {
    const api = stubApi();
    const net = createElectronFactory().ports.net?.();
    if (!net) throw new Error('the Electron host has no net port');
    expect(await net.read('https://lospec.com/x', { maxBytes: 10 })).toEqual({ bytes: new Uint8Array([7]), contentType: 'application/json', url: 'https://lospec.com/x' });
    expect(api.netRead).toHaveBeenCalledWith('https://lospec.com/x', { maxBytes: 10 });
  });

  it('passes the paths of a drag out to main', async () => {
    const api = stubApi();
    await dragOut(['C:\\art\\a.bxel']);
    expect(api.dragOut).toHaveBeenCalledWith(['C:\\art\\a.bxel']);
  });
});
