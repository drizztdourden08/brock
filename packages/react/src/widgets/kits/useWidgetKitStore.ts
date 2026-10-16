/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { isWidgetOpen, openWidget, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { defaultKitView } from './default-kit-view';
import { kitViewOf } from './kit-view-of';
import { readKitViews } from './read-kit-views';
import type { KitView, KitViews, WidgetKitState } from './widget-kit.type';

const withView = (state: WidgetKitState, id: string, patch: (view: KitView) => KitView): KitViews | Record<string, never> => {
  const view = kitViewOf(id, state);
  return view ? { views: { ...state.views, [id]: patch(view) } } : {};
};

const toggledMember = (state: WidgetKitState, id: string) => (layout: WidgetLayout): WidgetLayout =>
  (isWidgetOpen(layout, id) ? removeEverywhere(layout, id) : openWidget(layout, id, state.members));

const openedMember = (state: WidgetKitState, id: string) => (layout: WidgetLayout): WidgetLayout => openWidget(layout, id, state.members);

const memberToggle = (state: WidgetKitState, id: string): Partial<WidgetKitState> => {
  const kit = state.members.find((def) => def.id === id)?.kit;
  if (!kit || !state.kits.some((each) => each.id === kit)) return {};
  const change = state.active === kit ? toggledMember(state, id) : openedMember(state, id);
  return { active: kit, ...withView(state, kit, (view) => ({ ...view, layout: change(view.layout) })) };
};

const overlayToggle = (view: KitView, id: string): KitView =>
  ({ ...view, hidden: view.hidden.includes(id) ? view.hidden.filter((each) => each !== id) : [...view.hidden, id] });

const useWidgetKitStore = create<WidgetKitState>()((set) => ({
  kits: [],
  members: [],
  active: null,
  views: {},
  setKits: (kits, members) => set((state) => ({ kits, members, active: kits.some((kit) => kit.id === state.active) ? state.active : null })),
  open: (id) => set((state) => (state.kits.some((kit) => kit.id === id) ? { active: id } : {})),
  close: () => set({ active: null }),
  toggle: (id) => set((state) => (state.active === id ? { active: null } : { active: state.kits.some((kit) => kit.id === id) ? id : state.active })),
  setLayout: (layout) => set((state) => (state.active ? withView(state, state.active, (view) => ({ ...view, layout })) : {})),
  toggleMember: (id) => set((state) => memberToggle(state, id)),
  toggleOverlay: (id) => set((state) => (state.active ? withView(state, state.active, (view) => overlayToggle(view, id)) : {})),
  reset: (id) => set((state) => {
    const kit = state.kits.find((each) => each.id === id);
    return kit ? { views: { ...state.views, [id]: defaultKitView(kit, state.members) } } : {};
  }),
  replace: (stored) => set({ views: readKitViews(stored), active: null }),
}));

export { useWidgetKitStore };
