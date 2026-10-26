/* @layer renderer-shell @kind logic */
import { useContextMenuStore } from './useContextMenuStore';

const focusLost = (active: Element | null): boolean => active === null || active === document.body || active.closest('[role="menu"]') !== null;

const closeContextMenu = (): void => {
  const restore = useContextMenuStore.getState().open?.restore ?? null;
  useContextMenuStore.getState().hide();
  if (restore !== null && focusLost(document.activeElement)) restore.focus();
};

export { closeContextMenu };
