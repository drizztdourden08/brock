/* @layer renderer-shell @kind logic */
import { getWidgetDefinition, holdsMain, paneOf, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { parentOf } from './parent-of';
import { placeAt } from './place-at';
import { stackAxis } from './stack-axis';
import type { WidgetDef } from './widget.type';
import { widgetSideOf } from './widget-side-of';

const rankOf = (node: LayoutNode, definitions: readonly WidgetDef[]): number =>
  Math.min(Infinity, ...widgetsIn(node).flatMap((id) => getWidgetDefinition(definitions, id)?.order ?? []));

const slotOf = (siblings: readonly LayoutNode[], order: number, definitions: readonly WidgetDef[]): number =>
  siblings.reduce((slot, sibling, index) => (rankOf(sibling, definitions) <= order ? index + 1 : slot), 0);

const inOrder = (layout: WidgetLayout, id: string, definitions: readonly WidgetDef[]): WidgetLayout => {
  const order = getWidgetDefinition(definitions, id)?.order;
  const side = widgetSideOf(layout.dock, id);
  const key = paneOf(layout.dock, id)?.key;
  if (order === undefined || side === null || key === undefined) return layout;
  const parent = parentOf(layout.dock, key);
  if (parent?.axis !== stackAxis(side) || holdsMain(parent)) return layout;
  const others = parent.children.filter((child) => child.kind !== 'pane' || child.key !== key);
  return { ...layout, dock: placeAt(layout.dock, id, side, slotOf(others, order, definitions)) };
};

export { inOrder };
