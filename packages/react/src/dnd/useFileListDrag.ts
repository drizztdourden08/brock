/* @layer renderer-shell @kind hook */
import type { RefObject } from 'react';
import type { DndElement } from './dnd.type';
import { fileListDragSource } from './file-list-drag';
import type { FileListDragOptions } from './path-drop.type';
import { useDragSource } from './useDragSource';

const useFileListDrag = (ref: RefObject<DndElement | null>, options: FileListDragOptions): void => {
  useDragSource(ref, fileListDragSource(options));
};

export { useFileListDrag };
