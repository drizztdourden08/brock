/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { WidgetTitleState } from './widget.type';

const useWidgetTitleStore = create<WidgetTitleState>()((set) => ({
  titles: {},
  set: (id, text) => set((state) => {
    const clean = text === null ? '' : text.trim();
    if (clean === '') {
      if (!(id in state.titles)) return state;
      return { titles: Object.fromEntries(Object.entries(state.titles).filter(([key]) => key !== id)) };
    }
    return state.titles[id] === clean ? state : { titles: { ...state.titles, [id]: clean } };
  }),
}));

export { useWidgetTitleStore };
