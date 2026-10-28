/* @layer renderer-shell @kind logic */
import type { DragPoint, DropInfo } from './dnd.type';
import type { Hover, TargetEntry } from './target-entry.type';

const entries = new Map<Element, TargetEntry>();

const add = (entry: TargetEntry): (() => void) => {
  entries.set(entry.element, entry);
  return () => {
    if (entries.get(entry.element) === entry) entries.delete(entry.element);
  };
};

const infoOf = (entry: TargetEntry, point: DragPoint, type: string, source: Element | null): DropInfo => ({
  type,
  point,
  index: entry.options.index?.(point, entry.element) ?? null,
  source,
});

const judge = (entry: TargetEntry, point: DragPoint, type: string, payload: unknown, source: Element | null): Hover => {
  const info = infoOf(entry, point, type, source);
  const accepted = entry.names.has(type) && (entry.options.canDrop?.(payload, info) ?? true);
  return { entry, accepted, index: info.index };
};

const stackAt = (point: DragPoint): Element[] => (typeof document.elementsFromPoint === 'function' ? document.elementsFromPoint(point.x, point.y) : []);

const find = (point: DragPoint, type: string, payload: unknown, source: Element | null): Hover | null => {
  let first: Hover | null = null;
  for (const element of stackAt(point)) {
    const entry = entries.get(element);
    if (!entry) continue;
    const hover = judge(entry, point, type, payload, source);
    if (hover.accepted) return hover;
    first ??= hover;
  }
  return first;
};

const targetRegistry = { add, find, infoOf };

export { targetRegistry };
