/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WidgetRelayState } from './widget.type';

const listOf = (value: unknown): readonly unknown[] => (Array.isArray(value) ? value : []);

const useWidgetRelayStore = create<WidgetRelayState>()((set) => ({
  slices: {},
  receive: (kind, data) => set((state) => ({ slices: { ...state.slices, [kind]: data } })),
  append: (kind, items, limit) => set((state) => ({ slices: { ...state.slices, [kind]: [...listOf(state.slices[kind]), ...items].slice(-limit) } })),
}));

export { useWidgetRelayStore };
