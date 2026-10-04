/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../menu/menu.type';
import { useDeveloperTools } from '../app/useDeveloperTools';
import { buildWidgetMenuEntries } from './build-widget-menu-entries';
import { resetLayoutEntry } from './reset-layout-entry';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const useWidgetMenuEntries = (): MenuItem[] => {
  const developerTools = useDeveloperTools();
  const definitions = useWidgetLayoutStore((s) => s.definitions);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const toggle = useWidgetLayoutStore((s) => s.toggle);
  const reset = useWidgetLayoutStore((s) => s.reset);
  return useMemo(() => [...buildWidgetMenuEntries(definitions, layout, toggle, developerTools), resetLayoutEntry(reset)], [definitions, layout, toggle, developerTools, reset]);
};

export { useWidgetMenuEntries };
