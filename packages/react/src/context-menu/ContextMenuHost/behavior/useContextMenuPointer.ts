/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { cancelLongPress } from './cancel-long-press';
import { onContextMenu } from './on-context-menu';
import { onPointerDown } from './on-pointer-down';
import { onPointerMove } from './on-pointer-move';
import { onPointerUp } from './on-pointer-up';

const useContextMenuPointer = (): void => {
  useEffect(() => {
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointermove', onPointerMove, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', cancelLongPress, true);
    document.addEventListener('dragstart', cancelLongPress, true);
    document.addEventListener('contextmenu', onContextMenu);
    return () => {
      cancelLongPress();
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointermove', onPointerMove, true);
      document.removeEventListener('pointerup', onPointerUp, true);
      document.removeEventListener('pointercancel', cancelLongPress, true);
      document.removeEventListener('dragstart', cancelLongPress, true);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);
};

export { useContextMenuPointer };
