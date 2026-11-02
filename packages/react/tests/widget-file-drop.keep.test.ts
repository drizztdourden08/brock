/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class FakeElement extends EventTarget {
  attributes = new Map<string, string>();
  setAttribute(name: string, value: string): void { this.attributes.set(name, value); }
  removeAttribute(name: string): void { this.attributes.delete(name); }
  contains(other: unknown): boolean { return other === this; }
}

const GRANTED: Record<string, { path: string; kind: 'file' | 'folder' }> = {
  'C:\\art\\a.png': { path: 'C:\\art\\a.png', kind: 'file' },
  'C:\\art\\b.txt': { path: 'C:\\art\\b.txt', kind: 'file' },
  'C:\\art\\set': { path: 'C:\\art\\set', kind: 'folder' },
};

const osDrop = (names: string[]): Event =>
  Object.assign(new Event('drop', { cancelable: true }), { clientX: 5, clientY: 6, dataTransfer: { types: ['Files'], files: names.map((name) => ({ name }) as File), dropEffect: 'none' } });

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

const BYTES = new Uint8Array([0, 1, 2, 3, 4]).subarray(1, 4);

const setup = async () => {
  vi.resetModules();
  const read = vi.fn((path: string) => (GRANTED[path] ? Promise.resolve(BYTES) : Promise.reject(new Error('The file is outside every granted folder'))));
  const readText = vi.fn(() => Promise.resolve('hello'));
  const vet = vi.fn((paths: string[]) => Promise.resolve(paths.map((path) => ({ ...GRANTED[path], granted: true }))));
  vi.stubGlobal('window', { api: { documentVetDrop: vet } });
  vi.stubGlobal('document', { documentElement: new FakeElement(), elementsFromPoint: () => [] });
  vi.doMock('../src/platform/get-platform', () => ({
    getPlatform: () => ({ filePicker: { pathOf: (file: File) => `C:\\art\\${file.name}` }, documents: { read, readText, list: vi.fn() } }),
  }));
  const { dnd } = await import('../src/dnd/dnd');
  const { deliverFileDrop } = await import('../src/file-drop/deliver-file-drop');
  const { defineWidget } = await import('../src/widgets/define-widget');
  return { dnd, deliverFileDrop, defineWidget, read, readText };
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.doUnmock('../src/platform/get-platform');
  vi.unstubAllGlobals();
});

type Dropped = { reads: { path: string; data: unknown }[]; rejected: { name: string; reason: string }[]; paths: { name: string }[]; origin: string };

const wire = async (drop: { extensions?: string[]; read?: 'bytes' | 'text' | false; max?: number }) => {
  const ctx = await setup();
  const drops: Dropped[] = [];
  const options = { ...drop, onDrop: (value: unknown) => drops.push(value as Dropped) };
  const widget = ctx.defineWidget({ id: 'tray', label: 'Tray', render: () => null, drop: options });
  const target = new FakeElement();
  const zone = widget.drop as typeof options;
  ctx.dnd.target(target, { accepts: ctx.dnd.paths, paths: { extensions: zone.extensions }, onDrop: (value) => { void ctx.deliverFileDrop(value, zone); } });
  return { ...ctx, drops, target, widget };
};

describe('K5 widget file drop', () => {
  it('keeps the drop key on the widget definition', { tags: ['critical'] }, async () => {
    const { widget } = await wire({ read: false });
    expect(typeof widget.drop?.onDrop).toBe('function');
  });

  it('hands over the bytes of a dropped png and rejects a txt', { tags: ['critical'] }, async () => {
    const { target, drops, read } = await wire({ extensions: ['png'], read: 'bytes' });
    target.dispatchEvent(osDrop(['a.png', 'b.txt']));
    await settle();
    expect(read).toHaveBeenCalledOnce();
    expect(drops[0]?.paths.map((entry) => entry.name)).toEqual(['a.png']);
    expect(drops[0]?.rejected).toEqual([{ name: 'b.txt', reason: 'Not a supported file type' }]);
    const data = drops[0]?.reads[0]?.data as ArrayBuffer;
    expect(data.byteLength).toBe(3);
    expect([...new Uint8Array(data)]).toEqual([1, 2, 3]);
  });

  it('reads text when asked and skips folders', { tags: ['standard'] }, async () => {
    const { target, drops, readText } = await wire({ read: 'text' });
    target.dispatchEvent(osDrop(['a.png', 'set']));
    await settle();
    expect(readText).toHaveBeenCalledOnce();
    expect(drops[0]?.reads).toEqual([{ path: 'C:\\art\\a.png', data: 'hello' }]);
    expect(drops[0]?.paths.map((entry) => entry.name)).toEqual(['a.png', 'set']);
  });

  it('gives paths only when read is off', { tags: ['standard'] }, async () => {
    const { target, drops, read, readText } = await wire({});
    target.dispatchEvent(osDrop(['a.png']));
    await settle();
    expect(read).not.toHaveBeenCalled();
    expect(readText).not.toHaveBeenCalled();
    expect(drops[0]?.reads).toEqual([]);
  });

  it('takes an app drag with its paths and filters it by extension', { tags: ['critical'] }, async () => {
    const { deliverFileDrop, drops, read } = await wire({ extensions: ['png'], read: 'bytes' });
    const app = { origin: 'app', paths: [{ path: 'C:\\art\\a.png', name: 'a.png', kind: 'file' }, { path: 'C:\\art\\b.txt', name: 'b.txt', kind: 'file' }], rejected: [], entries: [], truncated: false } as const;
    await deliverFileDrop(app, { extensions: ['png'], read: 'bytes', onDrop: (value) => drops.push(value as unknown as Dropped) });
    expect(drops[0]?.origin).toBe('app');
    expect(drops[0]?.paths.map((entry) => entry.name)).toEqual(['a.png']);
    expect(read).toHaveBeenCalledOnce();
  });

  it('refuses a path outside every grant through the read port', { tags: ['critical'] }, async () => {
    const { deliverFileDrop, drops } = await wire({ read: 'bytes' });
    const app = { origin: 'app', paths: [{ path: 'D:\\other\\x.png', name: 'x.png', kind: 'file' }], rejected: [], entries: [], truncated: false } as const;
    await deliverFileDrop(app, { read: 'bytes', onDrop: (value) => drops.push(value as unknown as Dropped) });
    expect(drops[0]?.reads).toEqual([]);
    expect(drops[0]?.paths).toEqual([]);
    expect(drops[0]?.rejected).toEqual([{ name: 'x.png', reason: 'The file is outside every granted folder' }]);
  });

  it('caps the files per drop at max and at 64', { tags: ['standard'] }, async () => {
    const { deliverFileDrop, drops } = await wire({});
    const many = Array.from({ length: 70 }, (_, index) => ({ path: `C:\\art\\${index}.png`, name: `${index}.png`, kind: 'file' as const }));
    const base = { origin: 'app', rejected: [], entries: [], truncated: false } as const;
    await deliverFileDrop({ ...base, paths: many.slice(0, 3) }, { max: 2, onDrop: (value) => drops.push(value as unknown as Dropped) });
    await deliverFileDrop({ ...base, paths: many }, { max: 500, onDrop: (value) => drops.push(value as unknown as Dropped) });
    expect(drops[0]?.paths).toHaveLength(2);
    expect(drops[0]?.rejected).toEqual([{ name: '2.png', reason: 'Too many files in one drop' }]);
    expect(drops[1]?.paths).toHaveLength(64);
    expect(drops[1]?.rejected).toHaveLength(6);
  });
});
