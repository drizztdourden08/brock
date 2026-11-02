/* @layer renderer-shell @kind logic */
import type { DndElement, DropTargetOptions } from './dnd.type';
import { registerTarget } from './register-target';

const dropTarget = <T,>(element: DndElement, options: DropTargetOptions<T>): (() => void) => registerTarget(element, options, false);

export { dropTarget };
