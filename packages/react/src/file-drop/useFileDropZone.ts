/* @layer renderer-shell @kind hook */
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { dnd, useDropTarget } from '../dnd';
import type { DndElement, PathDrop } from '../dnd';
import { deliverFileDrop } from './deliver-file-drop';
import type { FileDropOptions } from './file-drop.type';

const useFileDropZone = (ref: RefObject<DndElement | null>, options: FileDropOptions): { over: boolean } => {
  const [over, setOver] = useState(false);
  const latest = useRef(options);
  latest.current = options;
  useDropTarget<PathDrop>(ref, {
    accepts: dnd.paths,
    paths: { extensions: options.extensions },
    feedback: ({ phase, accepted }) => setOver(accepted && (phase === 'enter' || phase === 'over')),
    onDrop: (drop) => {
      setOver(false);
      void deliverFileDrop(drop, latest.current);
    },
  });
  return { over };
};

export { useFileDropZone };
