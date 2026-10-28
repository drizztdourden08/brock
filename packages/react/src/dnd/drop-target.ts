/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE } from './dnd.constants';
import type { DndElement, DropFeedback, DropTargetOptions } from './dnd.type';
import { watchFileDrops } from './watch-file-drops';
import type { TargetEntry } from './target-entry.type';
import { targetRegistry } from './target-registry';

const namesOf = (accepts: DropTargetOptions<unknown>['accepts']): ReadonlySet<string> =>
  new Set((Array.isArray(accepts) ? accepts : [accepts]).map((type: { name: string }) => type.name));

const erased = <T,>(options: DropTargetOptions<T>): DropTargetOptions<unknown> => ({
  accepts: options.accepts,
  onDrop: (payload, info) => options.onDrop(payload as T, info),
  canDrop: options.canDrop ? (payload, info) => options.canDrop?.(payload as T, info) ?? true : undefined,
  feedback: options.feedback ? (feedback) => options.feedback?.(feedback as DropFeedback<T>) : undefined,
  index: options.index,
});

const dropTarget = <T,>(element: DndElement, options: DropTargetOptions<T>): (() => void) => {
  const entry: TargetEntry = { element, options: erased(options), names: namesOf(options.accepts) };
  const forget = targetRegistry.add(entry);
  const unwatch = entry.names.has(FILES_DRAG_TYPE) ? watchFileDrops(entry) : (): void => undefined;
  return () => {
    unwatch();
    forget();
  };
};

export { dropTarget };
