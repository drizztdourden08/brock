/* @layer renderer-shell @kind logic */
import { getWidgetDefinition, visibleLayoutOf } from '@drizztdourden08/tessera/composites';
import type { PoppedWidget, WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';

const poppedShown = (layout: WidgetLayout, gates: WidgetGates): PoppedWidget[] =>
  visibleLayoutOf(layout, gates).popped.filter((p) => getWidgetDefinition(gates.definitions, p.id)?.popOut === true);

export { poppedShown };
