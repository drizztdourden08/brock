/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import type { SearchAction } from '../../../search/search.type';
import { useSearchIndex } from '../../../search/useSearchIndex';
import { usePaletteStore } from '../../usePaletteStore';
import type { PaletteItem, PaletteModel } from '../PaletteHost.type';
import { paletteGroups } from './palette-groups';
import { useStandardActions } from './useStandardActions';

const useSearchPalette = (menu: readonly MenuEntry[], actions: readonly SearchAction[]): PaletteModel => {
  const open = usePaletteStore((s) => s.open);
  const query = usePaletteStore((s) => s.query);
  const setQuery = usePaletteStore((s) => s.setQuery);
  const close = usePaletteStore((s) => s.hide);
  const standard = useStandardActions();
  const given = useMemo(() => [...actions, ...standard], [actions, standard]);
  const catalog = useSearchIndex(open, menu, given);
  const groups = useMemo(() => paletteGroups(catalog, query), [catalog, query]);
  const activeIndex = query.trim().length === 0 ? -1 : undefined;

  const runItem = useCallback((item: PaletteItem) => {
    close();
    item.run();
  }, [close]);

  return { open, query, setQuery, groups, activeIndex, runItem, close };
};

export { useSearchPalette };
