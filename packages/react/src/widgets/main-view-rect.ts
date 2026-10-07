/* @layer renderer-shell @kind logic */
import { GAP, layoutTree } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { DOCK_STAGE_SELECTOR } from './widget.constants';
import type { WidgetLayoutReading } from './widget.type';

const mainViewRect = (layout: WidgetLayout, root: ParentNode = document): WidgetLayoutReading['main'] => {
  const stage = root.querySelector(DOCK_STAGE_SELECTOR)?.getBoundingClientRect();
  if (!stage || stage.width <= 0 || stage.height <= 0) return null;
  const inner = { x: GAP, y: GAP, width: Math.max(0, stage.width - GAP * 2), height: Math.max(0, stage.height - GAP * 2) };
  const main = layoutTree(layout.dock, inner).leaves.find((leaf) => leaf.node.kind === 'main');
  return main ? { x: stage.x + main.rect.x, y: stage.y + main.rect.y, width: main.rect.width, height: main.rect.height } : null;
};

export { mainViewRect };
