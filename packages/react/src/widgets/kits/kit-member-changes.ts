/* @layer renderer-shell @kind logic */
import { getWidgetDefinition, isWidgetOpen, openWidget, popOutWidget, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { kitViewOf } from './kit-view-of';
import type { KitView, KitViews, WidgetKitState } from './widget-kit.type';

type KitSource = Pick<WidgetKitState, 'kits' | 'members' | 'views'>;
type LayoutChange = (layout: WidgetLayout) => WidgetLayout;

const memberKitOf = (state: Pick<WidgetKitState, 'kits' | 'members'>, id: string): string | null => {
  const kit = state.members.find((def) => def.id === id)?.kit;
  return kit !== undefined && state.kits.some((each) => each.id === kit) ? kit : null;
};

const withView = (state: KitSource, id: string, patch: (view: KitView) => KitView): KitViews | Record<string, never> => {
  const view = kitViewOf(id, state);
  return view ? { views: { ...state.views, [id]: patch(view) } } : {};
};

const withLayout = (state: KitSource, id: string, change: LayoutChange): KitViews | Record<string, never> =>
  withView(state, id, (view) => ({ ...view, layout: change(view.layout) }));

const opened = (state: KitSource, id: string): LayoutChange => (layout) => (isWidgetOpen(layout, id) ? layout : openWidget(layout, id, state.members));

const toggled = (state: KitSource, id: string): LayoutChange => (layout) => (isWidgetOpen(layout, id) ? removeEverywhere(layout, id) : openWidget(layout, id, state.members));

const poppedOut = (state: KitSource, id: string): LayoutChange => (layout) => (getWidgetDefinition(state.members, id)?.popOut === true ? popOutWidget(layout, id) : layout);

const memberOpen = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? { active: kit, ...withLayout(state, kit, opened(state, id)) } : {};
};

const memberToggle = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  if (!kit) return {};
  return { active: kit, ...withLayout(state, kit, state.active === kit ? toggled(state, id) : opened(state, id)) };
};

const memberClose = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? withLayout(state, kit, (layout) => removeEverywhere(layout, id)) : {};
};

const memberPopOut = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? { active: kit, ...withLayout(state, kit, poppedOut(state, id)) } : {};
};

const activeChange = (state: WidgetKitState, change: LayoutChange): Partial<WidgetKitState> => (state.active ? withLayout(state, state.active, change) : {});

export { activeChange, memberClose, memberKitOf, memberOpen, memberPopOut, memberToggle, withView };
