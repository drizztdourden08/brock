/* @layer renderer-shell @kind logic */
import { PATHS_DRAG_TYPE } from './dnd.constants';
import type { DragSourceOptions } from './dnd.type';
import { defineDragType } from './define-drag-type';
import type { FileListDragOptions, PathDrop } from './path-drop.type';

const pathsType = defineDragType<PathDrop>(PATHS_DRAG_TYPE);

const appDrop = (options: FileListDragOptions): PathDrop => ({ origin: 'app', paths: options.paths(), rejected: [], entries: [], truncated: false });

const fileListDragSource = (options: FileListDragOptions): DragSourceOptions<PathDrop> => ({
  type: pathsType,
  payload: () => appDrop(options),
  get disabled() { return options.disabled; },
  get preview() { return options.preview; },
});

export { fileListDragSource };
