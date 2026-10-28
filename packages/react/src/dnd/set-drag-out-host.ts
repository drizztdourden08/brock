/* @layer renderer-shell @kind logic */
import type { DragOutHost } from './dnd.type';
import { dragOutState } from './drag-out-state';

const setDragOutHost = (host: DragOutHost | null): void => {
  dragOutState.host = host;
};

export { setDragOutHost };
