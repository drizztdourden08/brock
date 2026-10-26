/* @layer renderer-shell @kind logic */
import { useContextMenuStore } from './useContextMenuStore';

const blockContextMenus = (blocked: boolean): void => useContextMenuStore.getState().block(blocked);

export { blockContextMenus };
