/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE } from './dnd.constants';
import type { DropTargetOptions } from './dnd.type';
import { watchFileDrops } from './watch-file-drops';
import type { TargetEntry } from './target-entry.type';
import { targetRegistry } from './target-registry';

const namesOf = (accepts: DropTargetOptions<unknown>['accepts']): ReadonlySet<string> =>
  new Set((Array.isArray(accepts) ? accepts : [accepts]).map((type: { name: string }) => type.name));

const dropTarget = <T,>(element: Element, options: DropTargetOptions<T>): (() => void) => {
  const entry: TargetEntry = { element, options: options as unknown as DropTargetOptions<unknown>, names: namesOf(options.accepts) };
  const forget = targetRegistry.add(entry);
  const unwatch = entry.names.has(FILES_DRAG_TYPE) ? watchFileDrops(entry) : (): void => undefined;
  return () => {
    unwatch();
    forget();
  };
};

export { dropTarget };
