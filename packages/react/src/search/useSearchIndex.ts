/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useBrock } from '../app/useBrock';
import { useDeveloperTools } from '../app/useDeveloperTools';
import type { MenuEntry } from '../menu/menu.type';
import { usePlatform } from '../platform/usePlatform';
import { useScreenRegistry } from '../screens/useScreenRegistry';
import { useProfilesStore } from '../stores/useProfilesStore';
import { useSettings } from '../stores/useSettings';
import { useWidgetMenuEntries } from '../widgets/useWidgetMenuEntries';
import { buildCatalog } from './catalog/build-catalog';
import { settingsPlaceOf } from './catalog/settings-place-of';
import type { SearchAction, SearchEntry } from './search.type';
import { useLiveSearchStore } from './useLiveSearchStore';
import { useSearchActionStore } from './useSearchActionStore';

const useSearchIndex = (enabled: boolean, menu: readonly MenuEntry[], given: readonly SearchAction[]): SearchEntry[] => {
  const { home, tabs, screenTree } = useBrock();
  const registry = useScreenRegistry();
  const { info } = usePlatform();
  const developerTools = useDeveloperTools();
  const hasProfile = useProfilesStore((s) => s.active !== null);
  const { settings, patch, hydrated } = useSettings<object>();
  const registered = useSearchActionStore((s) => s.actions);
  const live = useLiveSearchStore((s) => s.entries);
  const widgets = useWidgetMenuEntries();

  return useMemo(() => (enabled ? buildCatalog({
    index: screenTree?.search ?? [],
    live,
    menu,
    widgets,
    screens: registry.list(),
    home,
    tabs,
    settingsPlace: settingsPlaceOf(screenTree),
    settings: hydrated ? settings : null,
    patch,
    actions: [...given, ...registered],
    isDev: developerTools,
    isMobile: info.formFactor === 'mobile',
    hasProfile,
  }) : []), [enabled, screenTree, live, menu, widgets, registry, home, tabs, hydrated, settings, patch, given, registered, developerTools, info, hasProfile]);
};

export { useSearchIndex };
