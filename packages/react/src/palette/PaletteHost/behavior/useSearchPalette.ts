/* @layer renderer-shell @kind hook */
import { createElement, useCallback, useMemo } from 'react';
import type { MenuEntry } from '../../../menu/menu.type';
import type { SearchAction } from '../../../search/search.type';
import { useSearchIndex } from '../../../search/useSearchIndex';
import { usePaletteStore } from '../../usePaletteStore';
import type { PaletteItem, PaletteModel } from '../PaletteHost.type';
import { PaletteConfirm } from '../sub-components/PaletteConfirm';
import { paletteGroups } from './palette-groups';
import { usePaletteScope } from './usePaletteScope';
import { useStandardActions } from './useStandardActions';
import { withConfirmActions } from './with-confirm-actions';

const useSearchPalette = (menu: readonly MenuEntry[], actions: readonly SearchAction[]): PaletteModel => {
  const open = usePaletteStore((s) => s.open);
  const query = usePaletteStore((s) => s.query);
  const asking = usePaletteStore((s) => s.asking);
  const setQuery = usePaletteStore((s) => s.setQuery);
  const close = usePaletteStore((s) => s.hide);
  const ask = usePaletteStore((s) => s.ask);
  const settle = usePaletteStore((s) => s.settle);
  const standard = useStandardActions();
  const given = useMemo(() => [...actions, ...standard], [actions, standard]);
  const catalog = useSearchIndex(open, menu, given);
  const scope = usePaletteScope();
  const activeIndex = query.trim().length === 0 ? -1 : undefined;

  const runNow = useCallback((item: PaletteItem) => {
    close();
    item.run();
  }, [close]);

  const ranked = useMemo(() => paletteGroups(catalog, query, scope), [catalog, query, scope]);
  const groups = useMemo(() => withConfirmActions(
    ranked,
    (item) => createElement(PaletteConfirm, { item, armed: asking === item.id, onArm: () => ask(item.id), onConfirm: () => runNow(item), onSettle: settle }),
  ), [ranked, asking, ask, runNow, settle]);

  const runItem = useCallback((item: PaletteItem) => {
    if (item.confirm === undefined) runNow(item);
    else ask(item.id);
  }, [ask, runNow]);

  return { open, query, setQuery, groups, activeIndex, runItem, close };
};

export { useSearchPalette };
