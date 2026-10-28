/* @layer renderer-shell @kind types */
import type { DndElement, DragPoint, DropTargetOptions } from './dnd.type';

interface TargetEntry {
  element: DndElement;
  options: DropTargetOptions<unknown>;
  names: ReadonlySet<string>;
}

interface Hover {
  entry: TargetEntry;
  accepted: boolean;
  index: number | null;
}

interface Probe {
  point: DragPoint;
  type: string;
  payload: unknown;
  source: DndElement | null;
}

export type { Hover, Probe, TargetEntry };
