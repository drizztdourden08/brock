/* @layer renderer-shell @kind types */
import type { DropTargetOptions } from './dnd.type';

interface TargetEntry {
  element: Element;
  options: DropTargetOptions<unknown>;
  names: ReadonlySet<string>;
}

interface Hover {
  entry: TargetEntry;
  accepted: boolean;
  index: number | null;
}

export type { Hover, TargetEntry };
