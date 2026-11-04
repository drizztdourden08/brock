/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import { sameFeed } from '../same-feed';
import type { TrackerFeedState } from '../tracker-feed-state.type';

const useTrackerFeedStore = create<TrackerFeedState>((set, get) => ({
  feed: null,
  publish: (next) => {
    if (!sameFeed(get().feed, next)) set({ feed: next });
  },
}));

export { useTrackerFeedStore };
