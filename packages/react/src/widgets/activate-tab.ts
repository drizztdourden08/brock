/* @layer renderer-shell @kind logic */
import type { LayoutNode, WidgetLayout } from '@drizztdourden08/tessera/composites';

const activated = (node: LayoutNode, id: string): LayoutNode => {
  if (node.kind === 'pane') return node.widgets.includes(id) && node.active !== id ? { ...node, active: id } : node;
  const children = node.children.map((child) => activated(child, id));
  return children.some((child, index) => child !== node.children[index]) ? { ...node, children } : node;
};

const activateTab = (layout: WidgetLayout, id: string): WidgetLayout => {
  const dock = activated(layout.dock, id);
  return dock === layout.dock ? layout : { ...layout, dock };
};

export { activateTab };
