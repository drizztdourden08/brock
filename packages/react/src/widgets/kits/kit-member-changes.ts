/* @layer renderer-shell @kind logic */
import { getWidgetDefinition, isWidgetOpen, popOutWidget, removeEverywhere } from '@drizztdourden08/tessera/composites';
import { openOrdered } from '../open-ordered';
import { kitViewOf } from './kit-view-of';
import { memberKitOf } from './member-kit-of';
import type { KitLayoutChange, KitSource, KitView, KitViews, WidgetKitState } from './widget-kit.type';

const withView = (state: KitSource, id: string, patch: (view: KitView) => KitView): KitViews | Record<string, never> => {
  const view = kitViewOf(id, state);
  return view ? { views: { ...state.views, [id]: patch(view) } } : {};
};

const withLayout = (state: KitSource, id: string, change: KitLayoutChange): KitViews | Record<string, never> =>
  withView(state, id, (view) => ({ ...view, layout: change(view.layout) }));

const opened = (state: KitSource, id: string): KitLayoutChange => (layout) => (isWidgetOpen(layout, id) ? layout : openOrdered(layout, id, state.members));

const toggled = (state: KitSource, id: string): KitLayoutChange => (layout) => (isWidgetOpen(layout, id) ? removeEverywhere(layout, id) : openOrdered(layout, id, state.members));

const poppedOut = (state: KitSource, id: string): KitLayoutChange => (layout) => (getWidgetDefinition(state.members, id)?.popOut === true ? popOutWidget(layout, id) : layout);

const open = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? { active: kit, ...withLayout(state, kit, opened(state, id)) } : {};
};

const toggle = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  if (!kit) return {};
  return { active: kit, ...withLayout(state, kit, state.active === kit ? toggled(state, id) : opened(state, id)) };
};

const close = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? withLayout(state, kit, (layout) => removeEverywhere(layout, id)) : {};
};

const popOut = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = memberKitOf(state, id);
  return kit ? { active: kit, ...withLayout(state, kit, poppedOut(state, id)) } : {};
};

const active = (state: WidgetKitState, change: KitLayoutChange): Partial<WidgetKitState> => (state.active ? withLayout(state, state.active, change) : {});

const kitMemberChanges = { open, toggle, close, popOut, active, withView };

export { kitMemberChanges };
