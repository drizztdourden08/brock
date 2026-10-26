/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { ContextMenuSource } from './context-menu.type';
import { normalizeSource } from './normalize-source';
import { useContextMenuStore } from './useContextMenuStore';

const useContextMenu = (zone: string, source: ContextMenuSource): void => {
  useEffect(() => {
    useContextMenuStore.getState().setMenu(zone, normalizeSource(source));
  });
  useEffect(() => () => useContextMenuStore.getState().clearMenu(zone), [zone]);
};

export { useContextMenu };
