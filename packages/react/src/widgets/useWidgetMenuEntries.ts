/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../menu/menu.type';
import { usePlatform } from '../platform/usePlatform';
import { buildWidgetMenuEntries } from './build-widget-menu-entries';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';

const useWidgetMenuEntries = (): MenuItem[] => {
  const { info } = usePlatform();
  const definitions = useWidgetLayoutStore((s) => s.definitions);
  const layout = useWidgetLayoutStore((s) => s.layout);
  const toggle = useWidgetLayoutStore((s) => s.toggle);
  return useMemo(() => buildWidgetMenuEntries(definitions, layout, toggle, info.isDev), [definitions, layout, toggle, info.isDev]);
};

export { useWidgetMenuEntries };
