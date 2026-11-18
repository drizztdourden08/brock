/* @layer renderer-shell @kind hook */
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { dnd, useDropTarget } from '../dnd';
import { useT } from '../i18n';
import type { DndElement, PathDrop } from '../dnd';
import { deliverFileDrop } from './deliver-file-drop';
import type { FileDropOptions } from './file-drop.type';

const useFileDropZone = (ref: RefObject<DndElement | null>, options: FileDropOptions): { over: boolean } => {
  const [over, setOver] = useState(false);
  const t = useT();
  const latest = useRef(options);
  latest.current = options;
  const words = { tooMany: t('brock-app:fileDrop.tooMany'), notSupported: t('brock-app:fileDrop.notSupported'), notReadable: t('brock-app:fileDrop.notReadable') };
  const wordsRef = useRef(words);
  wordsRef.current = words;
  useDropTarget<PathDrop>(ref, {
    accepts: dnd.paths,
    paths: { extensions: options.extensions },
    feedback: ({ phase, accepted }) => setOver(accepted && (phase === 'enter' || phase === 'over')),
    onDrop: (drop) => {
      setOver(false);
      void deliverFileDrop(drop, latest.current, wordsRef.current);
    },
  });
  return { over };
};

export { useFileDropZone };
