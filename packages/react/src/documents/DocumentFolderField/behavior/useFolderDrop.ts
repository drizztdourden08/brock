/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { dnd, useDropTarget } from '../../../dnd';
import type { DndElement } from '../../../dnd';
import { FOLDER_FIELD_TEXT } from '../DocumentFolderField.constants';
import type { DocumentFolderFieldProps, FolderDropState } from '../DocumentFolderField.type';

const useFolderDrop = (ref: RefObject<DndElement | null>, { onChange, disabled }: DocumentFolderFieldProps): FolderDropState => {
  const [reason, setReason] = useState<string | null>(null);
  const [stamp, setStamp] = useState(0);

  useDropTarget(ref, {
    accepts: dnd.paths,
    canDrop: () => disabled !== true,
    onDrop: (drop) => {
      const folder = drop.paths.find((dropped) => dropped.kind === 'folder');
      setReason(folder ? null : (drop.rejected[0]?.reason ?? FOLDER_FIELD_TEXT.notFolder));
      if (!folder) return;
      onChange(folder.path);
      setStamp((count) => count + 1);
    },
  });

  const change = useCallback((path: string | null): void => {
    setReason(null);
    onChange(path);
  }, [onChange]);

  return { reason, stamp, change };
};

export { useFolderDrop };
