/* @layer renderer-shell @kind logic */
import type { WidgetDockBack } from '@drizztdourden08/brock-core';
import { dockOnEdge, findLeaf, floatInMain, getWidgetDefinition, patchPane, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { Rect, WidgetDefinition, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { dockOrigins } from './dock-origins';

const backToOrigin = (layout: WidgetLayout, id: string): WidgetLayout | null => {
  const origin = dockOrigins.of(id);
  if (!origin) return null;
  const cleared = removeEverywhere(layout, id);
  const pane = findLeaf(cleared.dock, origin.pane);
  if (pane?.kind !== 'pane') return null;
  const widgets = [...pane.widgets.slice(0, origin.index), id, ...pane.widgets.slice(origin.index)];
  return { ...cleared, dock: patchPane(cleared.dock, origin.pane, { widgets, active: id }) };
};

const dockBack = (
  layout: WidgetLayout, id: string, where: WidgetDockBack | undefined, context: { definitions: readonly WidgetDefinition[]; main: Rect },
): WidgetLayout => {
  if (where === 'close') return removeEverywhere(layout, id);
  const definition = getWidgetDefinition(context.definitions, id);
  if (where === 'float') return floatInMain(layout, id, context.main, definition);
  const origin = where === undefined ? backToOrigin(layout, id) : null;
  dockOrigins.forget(id);
  return origin ?? dockOnEdge(layout, id, where ?? definition?.defaultSide ?? 'right');
};

export { dockBack };
