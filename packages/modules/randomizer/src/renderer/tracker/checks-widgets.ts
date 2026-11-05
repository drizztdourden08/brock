/* @layer renderer-shell @kind logic */
import { widgetsFromFiles } from '@drizztdourden08/brock-react';
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { slottedWidgets } from '../game-registry/behavior/slotted-widgets';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { CHECKS_WIDGET_ID } from '../../widgets/checks.widget.constants';
import ChecksWidget, { meta } from '../../widgets/checks.widget';

const slotOf = () => useRandomizerGameStore.getState().game?.views?.checksWidget;

const checksWidgets: WidgetDef[] = slottedWidgets(widgetsFromFiles([{ id: CHECKS_WIDGET_ID, component: ChecksWidget, meta }]), slotOf);

export { checksWidgets };
