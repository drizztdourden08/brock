/* @layer renderer-shell @kind logic */
import { useTrackerFeedStore } from './behavior/useTrackerFeedStore';
import { startTrackerFeed } from './start-tracker-feed';

const retained: { mounts: number; stop: (() => void) | null } = { mounts: 0, stop: null };

const retainTrackerFeed = (): (() => void) => {
  retained.mounts += 1;
  if (retained.mounts === 1) retained.stop = startTrackerFeed();
  return () => {
    retained.mounts -= 1;
    if (retained.mounts > 0) return;
    retained.stop?.();
    retained.stop = null;
    useTrackerFeedStore.getState().publish(null);
  };
};

export { retainTrackerFeed };
