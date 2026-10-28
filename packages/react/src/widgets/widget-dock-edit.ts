/* @layer renderer-shell @kind logic */
import { dockOnEdge, getWidgetDefinition } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { placeAt } from './place-at';
import { DOCK_SIDES } from './widget-dock-edit.constants';
import { sizeDocked } from './widget-docked-size';
import { edgeWidths } from './widget-edge-widths';
import type { SizedLayout } from './widget-resize-edit.type';
import type { WidgetDef } from './widget.type';
import type { WidgetDockOptions } from './widget-snapshot.type';

const checkDock = (options: WidgetDockOptions): void => {
  if (!DOCK_SIDES.includes(options.side)) throw new Error(`Unknown side "${String(options.side)}". Use left, right, top or bottom.`);
  if (options.size !== undefined && !(Number.isFinite(options.size) && options.size > 0)) throw new Error('size must be a positive number of pixels.');
  if (options.index !== undefined && !(Number.isInteger(options.index) && options.index >= 0)) throw new Error('index must be a whole number, 0 or more.');
};

const dockEdit = (layout: WidgetLayout, def: WidgetDef, options: WidgetDockOptions, definitions: readonly WidgetDef[]): SizedLayout => {
  checkDock(options);
  const weightOf = (other: string): number | undefined => getWidgetDefinition(definitions, other)?.dockWeight;
  const docked = dockOnEdge(layout, def.id, options.side, { weight: def.dockWeight, weightOf });
  const placed = options.index === undefined ? docked : { ...docked, dock: placeAt(docked.dock, def.id, options.side, options.index) };
  if (options.size === undefined) return { layout: placed, reason: null };
  return sizeDocked(placed, def.id, options.size, edgeWidths(layout, options.side));
};

export { dockEdit };
