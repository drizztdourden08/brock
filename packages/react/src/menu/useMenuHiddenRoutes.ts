/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hiddenMenuRoutes } from './hidden-menu-routes';
import type { MenuEntry } from './menu.type';
import { useMenuHiddenStore } from './useMenuHiddenStore';

const useMenuHiddenRoutes = (entries: readonly MenuEntry[]): void => {
  const setRoutes = useMenuHiddenStore((s) => s.setRoutes);
  useEffect(() => {
    setRoutes(hiddenMenuRoutes(entries));
  }, [entries, setRoutes]);
};

export { useMenuHiddenRoutes };
