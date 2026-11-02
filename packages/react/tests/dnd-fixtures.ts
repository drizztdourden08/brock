/* @layer renderer-shell @kind test */
import { vi } from 'vitest';

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

const pointer = (type: string, x: number, y: number): Event => Object.assign(new Event(type, { cancelable: true }), { button: 0, pointerId: 1, clientX: x, clientY: y });

const dragWorld = { win: new EventTarget(), root: new FakeElement(), stack: [] as FakeElement[] };

const installDragWorld = (extraDocument: object = {}): void => {
  dragWorld.win = new EventTarget();
  dragWorld.root = new FakeElement();
  dragWorld.stack = [];
  vi.stubGlobal('window', dragWorld.win);
  vi.stubGlobal('document', { documentElement: dragWorld.root, elementsFromPoint: () => dragWorld.stack, ...extraDocument });
};

const dragPast = (row: FakeElement): void => {
  row.dispatchEvent(pointer('pointerdown', 5, 5));
  dragWorld.win.dispatchEvent(pointer('pointermove', 40, 40));
};

const dragOnto = (row: FakeElement, target: FakeElement): void => {
  dragPast(row);
  dragWorld.stack = [target];
  dragWorld.win.dispatchEvent(pointer('pointermove', 50, 40));
  dragWorld.win.dispatchEvent(pointer('pointerup', 50, 40));
};

const settle = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, 0); });

export { FakeElement, GRANTED, dragOnto, dragPast, dragWorld, installDragWorld, pointer, settle };
