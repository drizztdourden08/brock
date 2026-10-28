/* @layer renderer-shell @kind logic */
import type { DragType } from './dnd.type';

const defineDragType = <T,>(name: string): DragType<T> => {
  if (name === '') throw new Error('A drag type needs a name');
  return { name };
};

export { defineDragType };
