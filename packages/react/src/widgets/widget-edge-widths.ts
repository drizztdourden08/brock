/* @layer renderer-shell @kind logic */
import { layoutTree } from '@drizztdourden08/tessera/composites';
import type { SnapSide, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { EdgeWidth } from './widget-resize-edit.type';
import { sideAxis } from './widget-side-axis';
import { widgetSideOf } from './widget-side-of';
import { stageRect } from './widget-stage-rect';

const edgeWidths = (layout: WidgetLayout, side: SnapSide): EdgeWidth[] => {
  const axis = sideAxis(side);
  const seen = new Set<SnapSide>();
  return layoutTree(layout.dock, stageRect()).leaves.flatMap(({ node, rect }) => {
    const id = node.kind === 'pane' ? node.widgets[0] : undefined;
    const own = id === undefined ? null : widgetSideOf(layout.dock, id);
    if (id === undefined || own === null || sideAxis(own) !== axis || seen.has(own)) return [];
    seen.add(own);
    return [{ id, side: own, px: axis === 'row' ? rect.width : rect.height }];
  });
};

export { edgeWidths };
