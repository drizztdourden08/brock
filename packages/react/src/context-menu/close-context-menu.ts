/* @layer renderer-shell @kind logic */
import { useContextMenuStore } from './useContextMenuStore';

const closeContextMenu = (): void => {
  useContextMenuStore.getState().hide();
};

export { closeContextMenu };
