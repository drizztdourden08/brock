/* @layer renderer-shell @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';
import { dockOnEdge, floatInMain, getWidgetDefinition, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { Rect, WidgetDefinition, WidgetLayout } from '@drizztdourden08/tessera/composites';

const dockBack = (
  layout: WidgetLayout, id: string, where: WidgetDockBack | undefined, context: { definitions: readonly WidgetDefinition[]; main: Rect },
): WidgetLayout => {
  if (where === 'close') return removeEverywhere(layout, id);
  const definition = getWidgetDefinition(context.definitions, id);
  if (where === 'float') return floatInMain(layout, id, context.main, definition);
  return dockOnEdge(layout, id, where ?? definition?.defaultSide ?? 'right');
};

export { dockBack };
