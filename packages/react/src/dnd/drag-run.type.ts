/* @layer renderer-shell @kind types */
import type { DndElement, DragPoint, DragSourceOptions } from './dnd.type';
import type { Hover } from './target-entry.type';

interface DragGhost {
  move: (point: DragPoint) => void;
  remove: () => void;
}

interface Run {
  element: DndElement;
  options: DragSourceOptions<unknown>;
  start: DragPoint;
  pointerId: number;
  started: boolean;
  payload: unknown;
  hover: Hover | null;
  ghost: DragGhost | null;
  detach: () => void;
}

export type { DragGhost, Run };
