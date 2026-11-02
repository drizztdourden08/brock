/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dnd } from '../src/dnd/dnd';
import { fileListDragSource } from '../src/dnd/file-list-drag';

class FakeElement extends EventTarget {
  attributes = new Map<string, string>();
  setAttribute(name: string, value: string): void { this.attributes.set(name, value); }
  removeAttribute(name: string): void { this.attributes.delete(name); }
  contains(other: unknown): boolean { return other === this; }
}

class FakeNode {
  className = '';
  textContent = '';
  children: FakeNode[] = [];
  attributes = new Map<string, string>();
  vars = new Map<string, string>();
  style = { setProperty: (name: string, value: string): void => { this.vars.set(name, value); } };
  constructor(private readonly body: FakeNode[]) {}
  setAttribute(name: string, value: string): void { this.attributes.set(name, value); }
  append(child: FakeNode): void {
    this.children.push(child);
    if (this.isBody) this.body.push(child);
  }
  remove(): void { this.body.splice(0, this.body.length, ...this.body.filter((node) => node !== this)); }
  isBody = false;
}

const pointer = (type: string, x: number, y: number): Event => Object.assign(new Event(type, { cancelable: true }), { button: 0, pointerId: 1, clientX: x, clientY: y });

let win: EventTarget;
let root: FakeElement;
let body: FakeNode[] = [];

beforeEach(() => {
  win = new EventTarget();
  root = new FakeElement();
  body = [];
  const bodyNode = new FakeNode(body);
  bodyNode.isBody = true;
  vi.stubGlobal('window', win);
  vi.stubGlobal('document', { documentElement: root, body: bodyNode, elementsFromPoint: () => [], createElement: () => new FakeNode(body) });
});

const ghostOf = (): FakeNode => {
  const [first] = body;
  if (!first) throw new Error('no ghost on the body');
  return first;
};

afterEach(() => {
  win.dispatchEvent(pointer('pointercancel', 0, 0));
  vi.unstubAllGlobals();
});

describe('drag preview', () => {
  it('shows a ghost with the count and label once the drag starts, and follows the pointer', { tags: ['critical'] }, () => {
    const row = new FakeElement();
    const type = dnd.type<string[]>('sprites');
    dnd.source(row, { type, payload: ['a', 'b', 'c'], preview: { label: () => 'sprites', count: (list) => list.length } });
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    expect(body).toHaveLength(0);
    win.dispatchEvent(pointer('pointermove', 40, 50));
    expect(body).toHaveLength(1);
    const ghost = ghostOf();
    expect(ghost.className).toBe('brock-drag-ghost');
    expect(ghost.attributes.get('aria-hidden')).toBe('true');
    expect(ghost.children.map((part) => part.textContent)).toEqual(['3', 'sprites']);
    expect(ghost.vars.get('--drag-x')).toBe('40px');
    win.dispatchEvent(pointer('pointermove', 60, 70));
    expect(ghost.vars.get('--drag-x')).toBe('60px');
    expect(ghost.vars.get('--drag-y')).toBe('70px');
  });

  it('removes the ghost when the drag ends or is cancelled', { tags: ['critical'] }, () => {
    const row = new FakeElement();
    dnd.source(row, { type: dnd.type<number>('n'), payload: 1, preview: { label: 'one item' } });
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    expect(body).toHaveLength(1);
    win.dispatchEvent(pointer('pointerup', 40, 40));
    expect(body).toHaveLength(0);
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    expect(body).toHaveLength(1);
    win.dispatchEvent(pointer('pointercancel', 40, 40));
    expect(body).toHaveLength(0);
  });

  it('draws no count part for a label only preview', { tags: ['standard'] }, () => {
    const row = new FakeElement();
    dnd.source(row, { type: dnd.type<number>('n'), payload: 1, preview: { label: 'one item' } });
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    expect(ghostOf().children.map((part) => part.className)).toEqual(['brock-drag-ghost__label']);
  });

  it('draws nothing without a preview and never for a press that stays under the threshold', { tags: ['critical'] }, () => {
    const row = new FakeElement();
    dnd.source(row, { type: dnd.type<number>('n'), payload: 1 });
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    expect(body).toHaveLength(0);
    win.dispatchEvent(pointer('pointerup', 40, 40));
    const other = new FakeElement();
    dnd.source(other, { type: dnd.type<number>('n'), payload: 1, preview: { label: 'x' } });
    other.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 6, 6));
    expect(body).toHaveLength(0);
  });

  it('passes the preview of a file list drag through with the path payload', { tags: ['standard'] }, () => {
    const row = new FakeElement();
    const picked = [{ path: 'C:\\a.png', name: 'a.png', kind: 'file' as const }, { path: 'C:\\b.png', name: 'b.png', kind: 'file' as const }];
    dnd.source(row, fileListDragSource({ paths: () => picked, preview: { label: 'files', count: (drop) => drop.paths.length } }));
    row.dispatchEvent(pointer('pointerdown', 5, 5));
    win.dispatchEvent(pointer('pointermove', 40, 40));
    expect(ghostOf().children.map((part) => part.textContent)).toEqual(['2', 'files']);
  });
});
