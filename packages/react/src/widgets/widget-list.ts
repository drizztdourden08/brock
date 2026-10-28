/* @layer renderer-shell @kind logic */
import { floatingRect, frameOf, layoutTree, placementOf } from '@drizztdourden08/tessera/composites';
import type { LeafRect, Rect, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { DEFAULT_CONTEXT } from '../contexts/contexts.constants';
import { useContextsStore } from '../contexts/useContextsStore';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { useWidgetTitleStore } from './useWidgetTitleStore';
import { widgetAvailable } from './widget-available';
import { widgetSideOf } from './widget-side-of';
import { floatArea } from './widget-float-area';
import { NO_DOCK } from './widget-list.constants';
import type { DockedFacts } from './widget-list.type';
import { stageRect } from './widget-stage-rect';
import type { WidgetDef } from './widget.type';
import type { WidgetSnapshot } from './widget-snapshot.type';

const rounded = (rect: Rect): Rect => ({ x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) });

const dockedOf = (layout: WidgetLayout, leaves: readonly LeafRect[], id: string): DockedFacts => {
  const side = widgetSideOf(layout.dock, id);
  const own = leaves.find((leaf) => leaf.node.kind === 'pane' && leaf.node.widgets.includes(id));
  if (side === null || own?.node.kind !== 'pane') return NO_DOCK;
  const beside = leaves.filter((leaf) => leaf.node.kind === 'pane' && widgetSideOf(layout.dock, leaf.node.widgets[0] ?? '') === side);
  return {
    side,
    size: Math.round(side === 'left' || side === 'right' ? own.rect.width : own.rect.height),
    index: beside.indexOf(own),
    tab: own.node.widgets.indexOf(id),
  };
};

const snapshotOf = (def: WidgetDef, layout: WidgetLayout, leaves: readonly LeafRect[]): WidgetSnapshot => {
  const placement = placementOf(layout, def.id);
  const context = def.context ?? DEFAULT_CONTEXT;
  const floating = layout.floating.find((entry) => entry.id === def.id);
  return {
    id: def.id,
    label: useWidgetTitleStore.getState().titles[def.id] ?? def.label,
    visible: placement !== null,
    placement,
    ...(placement === 'docked' ? dockedOf(layout, leaves, def.id) : NO_DOCK),
    rect: floating ? rounded(floatingRect(floating, floatArea())) : null,
    popped: placement === 'popped',
    context,
    available: frameOf(layout, def.id, def).show === 'always' || widgetAvailable(def, useContextsStore.getState().contexts, null),
  };
};

const listWidgets = (): WidgetSnapshot[] => {
  const { definitions, layout } = useWidgetLayoutStore.getState();
  const { leaves } = layoutTree(layout.dock, stageRect());
  return definitions.map((def) => snapshotOf(def, layout, leaves));
};

export { listWidgets };
