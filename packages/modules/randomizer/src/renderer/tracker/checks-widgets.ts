/* @layer renderer-shell @kind logic */
import { widgetsFromFiles } from '@drizztdourden08/brock-react';
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { CHECKS_WIDGET_ID } from './checks-widget.constants';
import ChecksWidget, { meta } from './checks.widget';

const slotOf = () => useRandomizerGameStore.getState().game?.views?.checksWidget;

const checksWidgets: WidgetDef[] = widgetsFromFiles([{ id: CHECKS_WIDGET_ID, component: ChecksWidget, meta }]).map((def) => ({
  ...def,
  get context() {
    return slotOf()?.context;
  },
  get order() {
    return slotOf()?.order;
  },
}));

export { checksWidgets };
