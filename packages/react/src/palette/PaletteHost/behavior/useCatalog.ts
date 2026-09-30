/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useBrock } from '../../../app/useBrock';
import type { MenuEntry } from '../../../menu/menu.type';
import { usePlatform } from '../../../platform/usePlatform';
import { useScreenRegistry } from '../../../screens/useScreenRegistry';
import { useProfilesStore } from '../../../stores/useProfilesStore';
import { useSettings } from '../../../stores/useSettings';
import { buildCatalog } from '../../catalog/build-catalog';
import type { SearchAction, SearchEntry } from '../../palette.type';
import { useSearchActionStore } from '../../useSearchActionStore';
import { useStandardActions } from './useStandardActions';

const useCatalog = (open: boolean, menu: readonly MenuEntry[], given: readonly SearchAction[]): SearchEntry[] => {
  const { home, tabs } = useBrock();
  const registry = useScreenRegistry();
  const { info } = usePlatform();
  const hasProfile = useProfilesStore((s) => s.active !== null);
  const { settings, patch, hydrated } = useSettings<object>();
  const registered = useSearchActionStore((s) => s.actions);
  const standard = useStandardActions();

  return useMemo(() => (open ? buildCatalog({
    menu,
    screens: registry.list(),
    home,
    tabs,
    settings: hydrated ? settings : null,
    patch,
    actions: [...given, ...registered, ...standard],
    isDev: info.isDev,
    isMobile: info.formFactor === 'mobile',
    hasProfile,
  }) : []), [open, menu, registry, home, tabs, hydrated, settings, patch, given, registered, standard, info, hasProfile]);
};

export { useCatalog };
