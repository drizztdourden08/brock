/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WidgetRelayState } from './widget.type';

const useWidgetRelayStore = create<WidgetRelayState>()((set) => ({
  slices: {},
  receive: (kind, data) => set((state) => ({ slices: { ...state.slices, [kind]: data } })),
}));

export { useWidgetRelayStore };
