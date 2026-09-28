/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import { ARROW_STEP, IDLE_SCREEN_LIMIT } from '../../palette.constants';
import type { SearchAction, SearchEntry } from '../../palette.type';
import { rankEntries } from '../../rank-entries';
import { usePaletteStore } from '../../usePaletteStore';
import type { SearchPaletteModel } from '../SearchPalette.type';
import { useCatalog } from './useCatalog';

const useSearchPalette = (menu: readonly MenuEntry[], actions: readonly SearchAction[]): SearchPaletteModel => {
  const open = usePaletteStore((s) => s.open);
  const query = usePaletteStore((s) => s.query);
  const setQuery = usePaletteStore((s) => s.setQuery);
  const close = usePaletteStore((s) => s.hide);
  const catalog = useCatalog(open, menu, actions);
  const idle = query.trim().length === 0;
  const items = useMemo(
    () => (idle ? catalog.filter((entry) => entry.kind === 'screen').slice(0, IDLE_SCREEN_LIMIT) : rankEntries(catalog, query)),
    [idle, catalog, query],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setActiveIndex(0); }, [query]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, [open]);

  const runEntry = useCallback((entry: SearchEntry) => {
    if (entry.disabled) return;
    close();
    entry.run();
  }, [close]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    const step = ARROW_STEP[event.key];
    if (step !== undefined) {
      event.preventDefault();
      setActiveIndex((index) => Math.min(Math.max(index + step, 0), Math.max(items.length - 1, 0)));
      return;
    }
    const entry = items.at(activeIndex);
    if (event.key !== 'Enter' || !entry) return;
    event.preventDefault();
    if ((event.ctrlKey || event.metaKey) && entry.toggle) entry.toggle.flip();
    else runEntry(entry);
  }, [items, activeIndex, runEntry]);

  return { open, query, setQuery, items, idle, activeIndex, setActiveIndex, inputRef, handleKeyDown, runEntry, close };
};

export { useSearchPalette };
