/* @layer renderer-shell @kind logic */
import { getWidgetDefinition, visibleLayoutOf } from '@drizztdourden08/tessera/composites';
import type { PoppedWidget, WidgetDefinition, WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';

const poppedShown = <D extends WidgetDefinition>(layout: WidgetLayout, gates: WidgetGates<D>): PoppedWidget[] =>
  visibleLayoutOf(layout, gates).popped.filter((p) => getWidgetDefinition(gates.definitions, p.id)?.popOut === true);

export { poppedShown };
