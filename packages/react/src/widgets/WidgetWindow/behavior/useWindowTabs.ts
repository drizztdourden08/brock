/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetTab } from '@drizztdourden08/tessera/composites';
import { contextTitle } from '../../../contexts/context-title';
import { useContextLabel } from '../../../contexts/useContextLabel';
import type { WidgetDef } from '../../widget.type';

const useWindowTabs = (id: string, definition: WidgetDef | undefined): WidgetTab[] => {
  const contextLabel = useContextLabel(definition?.context);
  const label = contextTitle(definition?.label ?? id, contextLabel);
  const icon = definition?.icon;
  return useMemo(() => [{ id, label, icon }], [id, label, icon]);
};

export { useWindowTabs };
