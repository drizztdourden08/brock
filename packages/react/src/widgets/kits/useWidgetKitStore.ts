/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { dockOrigins } from '../dock-origins';
import { defaultKitView } from './default-kit-view';
import { kitMemberChanges as changes } from './kit-member-changes';
import { readKitViews } from './read-kit-views';
import type { KitView, WidgetKitState } from './widget-kit.type';

const overlayToggle = (view: KitView, id: string): KitView =>
  ({ ...view, hidden: view.hidden.includes(id) ? view.hidden.filter((each) => each !== id) : [...view.hidden, id] });

const recorded = (change: (layout: WidgetLayout) => WidgetLayout) => (prev: WidgetLayout): WidgetLayout => {
  const next = change(prev);
  dockOrigins.record(prev, next);
  return next;
};

const isKit = (state: WidgetKitState, id: string): boolean => state.kits.some((kit) => kit.id === id);

const useWidgetKitStore = create<WidgetKitState>()((set) => ({
  kits: [],
  members: [],
  active: null,
  views: {},
  setKits: (kits, members) => set((state) => ({ kits, members, active: kits.some((kit) => kit.id === state.active) ? state.active : null })),
  open: (id) => set((state) => (isKit(state, id) ? { active: id } : {})),
  close: () => set({ active: null }),
  toggle: (id) => set((state) => (state.active === id ? { active: null } : { active: isKit(state, id) ? id : state.active })),
  setLayout: (layout) => set((state) => changes.active(state, recorded(() => layout))),
  change: (fn) => set((state) => changes.active(state, recorded(fn))),
  openMember: (id) => set((state) => changes.open(state, id)),
  toggleMember: (id) => set((state) => changes.toggle(state, id)),
  closeMember: (id) => set((state) => changes.close(state, id)),
  popOutMember: (id) => set((state) => changes.popOut(state, id)),
  toggleOverlay: (id) => set((state) => (state.active ? changes.withView(state, state.active, (view) => overlayToggle(view, id)) : {})),
  reset: (id) => set((state) => {
    const kit = state.kits.find((each) => each.id === id);
    return kit ? { views: { ...state.views, [id]: defaultKitView(kit, state.members) } } : {};
  }),
  replace: (stored) => set({ views: readKitViews(stored), active: null }),
}));

export { useWidgetKitStore };
