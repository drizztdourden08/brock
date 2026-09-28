/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../menu/menu.type';
import { useDeveloperTools } from '../app/useDeveloperTools';
import { buildWidgetMenuEntries } from './build-widget-menu-entries';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const useWidgetMenuEntries = (): MenuItem[] => {
  const developerTools = useDeveloperTools();
  const definitions = useWidgetLayoutStore((s) => s.definitions);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const toggle = useWidgetLayoutStore((s) => s.toggle);
  return useMemo(() => buildWidgetMenuEntries(definitions, layout, toggle, developerTools), [definitions, layout, toggle, developerTools]);
};

export { useWidgetMenuEntries };
