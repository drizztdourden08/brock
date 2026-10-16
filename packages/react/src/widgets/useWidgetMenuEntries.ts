/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../menu/menu.type';
import { useDeveloperTools } from '../app/useDeveloperTools';
import { buildWidgetMenuEntries } from './build-widget-menu-entries';
import { useKitMenuEntries } from './kits/useKitMenuEntries';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import { resetLayoutEntry } from './reset-layout-entry';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const useWidgetMenuEntries = (): MenuItem[] => {
  const developerTools = useDeveloperTools();
  const definitions = useWidgetLayoutStore((s) => s.definitions);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const toggle = useWidgetLayoutStore((s) => s.toggle);
  const reset = useWidgetLayoutStore((s) => s.reset);
  const kits = useKitMenuEntries();
  const kitOpen = useWidgetKitStore((s) => s.active !== null);
  return useMemo(() => {
    const own = buildWidgetMenuEntries(definitions, layout, toggle, developerTools);
    const shown = kitOpen ? own.map((entry) => ({ ...entry, checked: false })) : own;
    return [...shown, ...kits, resetLayoutEntry(reset)];
  }, [definitions, layout, toggle, developerTools, kits, kitOpen, reset]);
};

export { useWidgetMenuEntries };
