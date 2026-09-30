/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import type { SearchAction } from '../../palette.type';
import { usePaletteStore } from '../../usePaletteStore';
import type { PaletteItem, PaletteModel } from '../PaletteHost.type';
import { paletteGroups } from './palette-groups';
import { useCatalog } from './useCatalog';

const useSearchPalette = (menu: readonly MenuEntry[], actions: readonly SearchAction[]): PaletteModel => {
  const open = usePaletteStore((s) => s.open);
  const query = usePaletteStore((s) => s.query);
  const setQuery = usePaletteStore((s) => s.setQuery);
  const close = usePaletteStore((s) => s.hide);
  const catalog = useCatalog(open, menu, actions);
  const groups = useMemo(() => paletteGroups(catalog, query), [catalog, query]);
  const activeIndex = query.trim().length === 0 ? -1 : undefined;

  const runItem = useCallback((item: PaletteItem) => {
    close();
    item.run();
  }, [close]);

  return { open, query, setQuery, groups, activeIndex, runItem, close };
};

export { useSearchPalette };
