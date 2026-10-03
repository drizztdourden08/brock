/* @layer renderer-shell @kind logic */
import { frameOf, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { PoppedWidget, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { PoppedGates } from './widget.type';

const isShown = (layout: WidgetLayout, id: string, gates: PoppedGates): boolean => {
  const definition = getWidgetDefinition(gates.definitions, id);
  if (definition?.popOut !== true) return false;
  if (definition.devOnly === true && !gates.developerTools) return false;
  return frameOf(layout, id, definition).show !== 'context-only' || (gates.contextActive && !gates.pageOpen);
};

const poppedShown = (layout: WidgetLayout, gates: PoppedGates): PoppedWidget[] => layout.popped.filter((p) => isShown(layout, p.id, gates));

export { poppedShown };
