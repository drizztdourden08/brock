/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE, PATHS_DRAG_TYPE } from './dnd.constants';
import type { DndElement, DropFeedback, DropTargetOptions } from './dnd.type';
import { watchFileDrops } from './watch-file-drops';
import type { TargetEntry } from './target-entry.type';
import { targetRegistry } from './target-registry';

const namesOf = (accepts: DropTargetOptions<unknown>['accepts']): ReadonlySet<string> =>
  new Set((Array.isArray(accepts) ? accepts : [accepts]).map((type: { name: string }) => type.name));

const erased = <T,>(options: DropTargetOptions<T>): DropTargetOptions<unknown> => ({
  get accepts() { return options.accepts; },
  get paths() { return options.paths; },
  onDrop: (payload, info) => options.onDrop(payload as T, info),
  canDrop: (payload, info) => options.canDrop?.(payload as T, info) ?? true,
  feedback: (feedback) => options.feedback?.(feedback as DropFeedback<T>),
  index: (point, el) => options.index?.(point, el) ?? null,
});

const registerTarget = <T,>(element: DndElement, options: DropTargetOptions<T>, windowWide: boolean): (() => void) => {
  const names = namesOf(options.accepts);
  const entry: TargetEntry = { element, options: erased(options), names, windowWide };
  const forget = targetRegistry.add(entry);
  const takesOsDrops = names.has(FILES_DRAG_TYPE) || names.has(PATHS_DRAG_TYPE);
  const unwatch = takesOsDrops ? watchFileDrops(entry) : (): void => undefined;
  return () => {
    unwatch();
    forget();
  };
};

export { registerTarget };
