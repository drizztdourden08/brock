/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useTrackerFeedStore } from '../../feed/behavior/useTrackerFeedStore';
import { retainTrackerFeed } from '../../feed/retain-tracker-feed';
import type { TrackerFeedInput } from '../../feed/tracker-feed-state.type';

const useTrackerFeed = (): TrackerFeedInput | null => {
  useEffect(() => retainTrackerFeed(), []);
  return useTrackerFeedStore((state) => state.feed);
};

export { useTrackerFeed };
