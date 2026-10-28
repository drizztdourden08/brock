/* @layer renderer-shell @kind types */
import type { DndElement, DragPoint, DragSourceOptions } from './dnd.type';
import type { Hover } from './target-entry.type';

interface Run {
  element: DndElement;
  options: DragSourceOptions<unknown>;
  start: DragPoint;
  pointerId: number;
  started: boolean;
  payload: unknown;
  hover: Hover | null;
  detach: () => void;
}

export type { Run };
