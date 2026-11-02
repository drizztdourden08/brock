/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeElement, GRANTED, settle } from './dnd-fixtures';

const FILE = (name: string) => ({ name }) as File;

const osEvent = (type: string, names: string[]): Event =>
  Object.assign(new Event(type, { cancelable: true }), { clientX: 5, clientY: 6, dataTransfer: { types: ['Files'], files: names.map(FILE), dropEffect: 'none' } });

const bubble = (event: Event, ...chain: FakeElement[]): void => {
  for (const element of chain) element.dispatchEvent(event);
};

const setup = async () => {
  vi.resetModules();
  const root = new FakeElement();
  const list = vi.fn((folder: string) => Promise.resolve({ entries: [{ path: `${folder}\\x.png`, name: 'x.png', kind: 'file', size: 1, modified: 0, link: false }], truncated: true }));
  const vet = vi.fn((paths: string[]) => Promise.resolve(paths.map((path) => ({ ...GRANTED[path], granted: true }))));
  vi.stubGlobal('window', { api: { documentVetDrop: vet } });
  vi.stubGlobal('document', { documentElement: root, elementsFromPoint: () => [] });
  vi.doMock('../src/platform/get-platform', () => ({
    getPlatform: () => ({
      filePicker: { pathOf: (file: File) => (file.name === 'web.png' ? null : `C:\\art\\${file.name}`) },
      documents: { list },
    }),
  }));
  const { dnd } = await import('../src/dnd/dnd');
  const { registerTarget } = await import('../src/dnd/register-target');
  return { dnd, registerTarget, root, list, vet };
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.doUnmock('../src/platform/get-platform');
  vi.unstubAllGlobals();
});

describe('K4 OS path drops', () => {
  it('gives a dnd.paths target vetted paths and no File', { tags: ['critical'] }, async () => {
    const { dnd } = await setup();
    const target = new FakeElement();
    const drops: unknown[] = [];
    dnd.target(target, { accepts: dnd.paths, onDrop: (drop) => drops.push(drop) });
    target.dispatchEvent(osEvent('drop', ['a.png', 'set']));
    await settle();
    expect(drops).toEqual([{
      origin: 'os',
      paths: [{ path: 'C:\\art\\a.png', name: 'a.png', kind: 'file' }, { path: 'C:\\art\\set', name: 'set', kind: 'folder' }],
      rejected: [],
      entries: [],
      truncated: false,
    }]);
    expect(Object.keys((drops[0] as { paths: object[] }).paths[0] ?? {})).toEqual(['path', 'name', 'kind']);
  });

  it('sends a file with no checkable path to rejected instead of passing it on', { tags: ['critical'] }, async () => {
    const { dnd } = await setup();
    const target = new FakeElement();
    const drops: { paths: readonly unknown[]; rejected: readonly unknown[] }[] = [];
    dnd.target(target, { accepts: dnd.paths, onDrop: (drop) => drops.push(drop) });
    target.dispatchEvent(osEvent('drop', ['web.png']));
    await settle();
    expect(drops[0]?.paths).toEqual([]);
    expect(drops[0]?.rejected).toEqual([{ name: 'web.png', reason: 'The path could not be checked' }]);
  });

  it('rejects a wrong extension after vetting and keeps folders', { tags: ['standard'] }, async () => {
    const { dnd } = await setup();
    const target = new FakeElement();
    const drops: { paths: readonly { name: string }[]; rejected: readonly unknown[] }[] = [];
    dnd.target(target, { accepts: dnd.paths, paths: { extensions: ['.PNG'] }, onDrop: (drop) => drops.push(drop) });
    target.dispatchEvent(osEvent('drop', ['a.png', 'b.txt', 'set']));
    await settle();
    expect(drops[0]?.paths.map((entry) => entry.name)).toEqual(['a.png', 'set']);
    expect(drops[0]?.rejected).toEqual([{ name: 'b.txt', reason: 'Not a supported file type' }]);
  });

  it('lists the content of dropped folders from main when expand is set', { tags: ['standard'] }, async () => {
    const { dnd, list } = await setup();
    const target = new FakeElement();
    const drops: { entries: readonly { path: string }[]; truncated: boolean }[] = [];
    dnd.target(target, { accepts: dnd.paths, paths: { expand: { recursive: true, extensions: ['png'] } }, onDrop: (drop) => drops.push(drop) });
    target.dispatchEvent(osEvent('drop', ['a.png', 'set']));
    await settle();
    expect(list).toHaveBeenCalledOnce();
    expect(list).toHaveBeenCalledWith('C:\\art\\set', { recursive: true, extensions: ['png'] });
    expect(drops[0]?.entries.map((entry) => entry.path)).toEqual(['C:\\art\\set\\x.png']);
    expect(drops[0]?.truncated).toBe(true);
  });

  it('keeps dnd.files callers unchanged', { tags: ['critical'] }, async () => {
    const { dnd, list } = await setup();
    const target = new FakeElement();
    const drops: { files: { name: string; path: string | null }[] }[] = [];
    dnd.target(target, { accepts: dnd.files, paths: { expand: {} }, onDrop: (drop) => drops.push(drop) });
    target.dispatchEvent(osEvent('drop', ['a.png']));
    await settle();
    expect(drops[0]?.files.map((file) => [file.name, file.path])).toEqual([['a.png', 'C:\\art\\a.png']]);
    expect(list).not.toHaveBeenCalled();
  });
});

describe('K4 window file drop', () => {
  it('fires when no inner target took the drop', { tags: ['critical'] }, async () => {
    const { dnd, registerTarget, root } = await setup();
    const seen: unknown[] = [];
    registerTarget(root, { accepts: dnd.paths, onDrop: (drop) => seen.push(drop.paths.length) }, true);
    const event = osEvent('drop', ['a.png']);
    bubble(event, new FakeElement(), root);
    await settle();
    expect(seen).toEqual([1]);
  });

  it('stays silent when an inner target took the drop', { tags: ['critical'] }, async () => {
    const { dnd, registerTarget, root } = await setup();
    const inner = new FakeElement();
    const seenInner: unknown[] = [];
    const seenWindow: unknown[] = [];
    dnd.target(inner, { accepts: dnd.paths, onDrop: (drop) => seenInner.push(drop.paths.length) });
    registerTarget(root, { accepts: dnd.paths, onDrop: (drop) => seenWindow.push(drop.paths.length) }, true);
    bubble(osEvent('drop', ['a.png']), inner, root);
    await settle();
    expect(seenInner).toEqual([1]);
    expect(seenWindow).toEqual([]);
  });

  it('shows no window outline while an inner target is hovered', { tags: ['standard'] }, async () => {
    const { dnd, registerTarget, root } = await setup();
    const inner = new FakeElement();
    dnd.target(inner, { accepts: dnd.paths, onDrop: () => undefined });
    registerTarget(root, { accepts: dnd.paths, onDrop: () => undefined }, true);
    bubble(osEvent('dragover', []), root);
    expect(root.attributes.get('data-drop')).toBe('over');
    bubble(osEvent('dragover', []), inner, root);
    expect(root.attributes.has('data-drop')).toBe(false);
    expect(inner.attributes.get('data-drop')).toBe('over');
  });
});
