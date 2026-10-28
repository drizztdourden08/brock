/* @layer renderer-shell @kind logic */
import type { DropInfo } from './dnd.type';
import type { Hover, Probe, TargetEntry } from './target-entry.type';

const entries = new Map<object, TargetEntry>();

const add = (entry: TargetEntry): (() => void) => {
  entries.set(entry.element, entry);
  return () => {
    if (entries.get(entry.element) === entry) entries.delete(entry.element);
  };
};

const infoOf = (entry: TargetEntry, probe: Probe): DropInfo => ({
  type: probe.type,
  point: probe.point,
  index: entry.options.index?.(probe.point, entry.element) ?? null,
  source: probe.source,
});

const judge = (entry: TargetEntry, probe: Probe): Hover => {
  const info = infoOf(entry, probe);
  const accepted = entry.names.has(probe.type) && (entry.options.canDrop?.(probe.payload, info) ?? true);
  return { entry, accepted, index: info.index };
};

const stackAt = (probe: Probe): object[] => (typeof document.elementsFromPoint === 'function' ? document.elementsFromPoint(probe.point.x, probe.point.y) : []);

const find = (probe: Probe): Hover | null => {
  let first: Hover | null = null;
  for (const element of stackAt(probe)) {
    const entry = entries.get(element);
    if (!entry) continue;
    const hover = judge(entry, probe);
    if (hover.accepted) return hover;
    first ??= hover;
  }
  return first;
};

const targetRegistry = { add, find, infoOf };

export { targetRegistry };
