/* @layer renderer-shell @kind logic */
import type { DragSession } from './dnd.type';

let current: DragSession | null = null;
const listeners = new Set<() => void>();

const notify = (): void => {
  for (const listener of [...listeners]) listener();
};

const set = (next: DragSession | null): void => {
  current = next;
  notify();
};

const get = (): DragSession | null => current;

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const dragSession = { get, set, subscribe };

export { dragSession };
