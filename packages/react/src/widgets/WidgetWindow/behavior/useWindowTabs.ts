/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { WidgetTab } from '@drizztdourden08/tessera/composites';
import { useText } from '../../../i18n';
import { useContextLabel } from '../../../contexts/useContextLabel';
import type { WidgetDef } from '../../widget.type';
import { widgetLabelOf } from '../../widget-label-of';

const useWindowTabs = (id: string, definition: WidgetDef | undefined): WidgetTab[] => {
  const sublabel = useContextLabel(definition?.context);
  const text = useText();
  const label = definition ? text(widgetLabelOf(definition)) : id;
  const icon = definition?.icon;
  return useMemo(() => [{ id, label, icon, sublabel }], [id, label, icon, sublabel]);
};

export { useWindowTabs };
