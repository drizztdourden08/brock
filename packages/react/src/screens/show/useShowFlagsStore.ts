/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { mergeShowFlags } from './merge-show-flags';
import { sameFlags } from './same-flags';
import { NO_FLAGS } from './show.constants';
import type { ShowFlagsState } from './show.type';

const useShowFlagsStore = create<ShowFlagsState>()((set, get) => ({
  sources: {},
  flags: NO_FLAGS,
  put: (source, values) => {
    const { sources } = get();
    if (sameFlags(sources[source], values)) return;
    const next = { ...sources, [source]: { ...values } };
    set({ sources: next, flags: mergeShowFlags(next) });
  },
  drop: (source) => {
    const { sources } = get();
    if (!(source in sources)) return;
    const next = Object.fromEntries(Object.entries(sources).filter(([key]) => key !== source));
    set({ sources: next, flags: mergeShowFlags(next) });
  },
}));

export { useShowFlagsStore };
