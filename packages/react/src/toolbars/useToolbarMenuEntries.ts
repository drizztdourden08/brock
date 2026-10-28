/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { MenuItem } from '../menu/menu.type';
import { useAvailableToolbars } from './useAvailableToolbars';
import { buildToolbarMenuEntries } from './build-toolbar-menu-entries';
import { useToolbarLayoutStore } from './useToolbarLayoutStore';

const useToolbarMenuEntries = (): MenuItem[] => {
  const words = useTesseraStrings().toolbars;
  const definitions = useAvailableToolbars(useToolbarLayoutStore((s) => s.definitions));
  const layout = useToolbarLayoutStore((s) => s.layout);
  const toggle = useToolbarLayoutStore((s) => s.toggle);
  const reset = useToolbarLayoutStore((s) => s.reset);
  return useMemo(() => buildToolbarMenuEntries({ definitions, layout, toggle, words, reset }), [definitions, layout, toggle, words, reset]);
};

export { useToolbarMenuEntries };
