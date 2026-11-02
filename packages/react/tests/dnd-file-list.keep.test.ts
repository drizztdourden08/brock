/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dnd } from '../src/dnd/dnd';
import { fileListDragSource } from '../src/dnd/file-list-drag';
import type { PathDrop } from '../src/dnd/path-drop.type';

class FakeElement extends EventTarget {
  attributes = new Map<string, string>();
  setAttribute(name: string, value: string): void { this.attributes.set(name, value); }
  removeAttribute(name: string): void { this.attributes.delete(name); }
  contains(other: unknown): boolean { return other === this; }
}

class FakeStrip extends FakeElement {
  constructor(private readonly boxes: { left: number; right: number; top: number; bottom: number }[]) { super(); }
  querySelectorAll(selector: string): { getBoundingClientRect: () => { left: number; right: number; top: number; bottom: number } }[] {
    return selector === '[role="tab"]' ? this.boxes.map((box) => ({ getBoundingClientRect: () => box })) : [];
  }
}

const pointer = (type: string, x: number, y: number): Event => Object.assign(new Event(type, { cancelable: true }), { button: 0, pointerId: 1, clientX: x, clientY: y });

const TABS = [
  { left: 0, right: 100, top: 0, bottom: 30 },
  { left: 100, right: 200, top: 0, bottom: 30 },
  { left: 200, right: 300, top: 0, bottom: 30 },
];

const ROWS = [
  { left: 0, right: 300, top: 0, bottom: 20 },
  { left: 0, right: 300, top: 20, bottom: 40 },
];

let win: EventTarget;
let root: FakeElement;
let stack: FakeElement[] = [];

beforeEach(() => {
  win = new EventTarget();
  root = new FakeElement();
  stack = [];
  vi.stubGlobal('window', win);
  vi.stubGlobal('document', { documentElement: root, elementsFromPoint: () => stack });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('K4 file list drag', () => {
  it('delivers origin app with the dragged paths to a dnd.paths target', { tags: ['critical'] }, () => {
    const row = new FakeElement();
    const target = new FakeElement();
    const drops: PathDrop[] = [];
    const picked = [{ path: 'C:\\art\\a.png', name: 'a.png', kind: 'file' as const }];
    dnd.source(row, fileListDragSource({ paths: () => picked }));
    dnd.target(target, { accepts: dnd.paths, onDrop: (drop) => drops.push(drop) });
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    stack = [target];
    win.dispatchEvent(pointer('pointermove', 50, 40));
    win.dispatchEvent(pointer('pointerup', 50, 40));
    expect(drops).toEqual([{ origin: 'app', paths: picked, rejected: [], entries: [], truncated: false }]);
  });

  it('reads the paths when the drag starts and honours disabled', { tags: ['standard'] }, () => {
    const row = new FakeElement();
    const target = new FakeElement();
    const drops: PathDrop[] = [];
    let current = [{ path: 'C:\\a', name: 'a', kind: 'file' as const }];
    let off = true;
    dnd.source(row, fileListDragSource({ paths: () => current, disabled: () => off }));
    dnd.target(target, { accepts: dnd.paths, onDrop: (drop) => drops.push(drop) });
    const drag = (): void => {
      row.dispatchEvent(pointer('pointerdown', 5, 5));
      win.dispatchEvent(pointer('pointermove', 40, 40));
      stack = [target];
      win.dispatchEvent(pointer('pointermove', 50, 40));
      win.dispatchEvent(pointer('pointerup', 50, 40));
    };
    drag();
    expect(drops).toEqual([]);
    off = false;
    current = [{ path: 'C:\\b', name: 'b', kind: 'file' }];
    drag();
    expect(drops.map((drop) => drop.paths[0]?.path)).toEqual(['C:\\b']);
  });
});

describe('K4 index among', () => {
  it('returns the insert index between tabs along x', { tags: ['critical'] }, () => {
    const strip = new FakeStrip(TABS);
    const indexAt = dnd.indexAmong('[role="tab"]');
    expect([10, 49, 51, 160, 260, 299].map((x) => indexAt({ x, y: 10 }, strip))).toEqual([0, 0, 1, 2, 3, 3]);
  });

  it('measures along y when asked', { tags: ['standard'] }, () => {
    const list = new FakeStrip(ROWS);
    const indexAt = dnd.indexAmong('[role="tab"]', 'y');
    expect([5, 15, 35].map((y) => indexAt({ x: 10, y }, list))).toEqual([0, 1, 2]);
  });

  it('gives zero for an empty strip and null for an element that cannot be queried', { tags: ['standard'] }, () => {
    const indexAt = dnd.indexAmong('[role="tab"]');
    expect(indexAt({ x: 10, y: 10 }, new FakeStrip([]))).toBe(0);
    expect(indexAt({ x: 10, y: 10 }, new FakeElement())).toBeNull();
  });
});
