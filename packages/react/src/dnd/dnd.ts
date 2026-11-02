/* @layer renderer-shell @kind logic */
import { FILES_DRAG_TYPE, PATHS_DRAG_TYPE } from './dnd.constants';
import type { DroppedFiles } from './dnd.type';
import { defineDragType } from './define-drag-type';
import { dragOut } from './drag-out';
import { dragSession } from './drag-session';
import { dragSource } from './drag-source';
import { dropTarget } from './drop-target';
import { indexAmong } from './index-among';
import type { PathDrop } from './path-drop.type';

const files = defineDragType<DroppedFiles>(FILES_DRAG_TYPE);

const paths = defineDragType<PathDrop>(PATHS_DRAG_TYPE);

const dnd = { type: defineDragType, source: dragSource, target: dropTarget, files, paths, indexAmong, dragOut, session: dragSession.get };

export { dnd };
