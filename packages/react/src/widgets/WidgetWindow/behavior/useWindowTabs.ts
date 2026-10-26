/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetTab } from '@drizztdourden08/tessera/composites';
import type { WidgetDef } from '../../widget.type';

const useWindowTabs = (id: string, definition: WidgetDef | undefined): WidgetTab[] => {
  const label = definition?.label ?? id;
  const icon = definition?.icon;
  return useMemo(() => [{ id, label, icon }], [id, label, icon]);
};

export { useWindowTabs };
