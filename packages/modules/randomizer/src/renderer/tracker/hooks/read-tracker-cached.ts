/* @layer renderer-shell @kind logic */
import { readTracker } from '../../../tracker';
import type { TrackerProvider, TrackerReading } from '../../../tracker';
import type { TrackerFeedInput } from '../feed/tracker-feed-state.type';

const caches = new WeakMap<object, WeakMap<object, Map<string, TrackerReading>>>();

const readTrackerCached = (provider: TrackerProvider<unknown>, feed: TrackerFeedInput, assumed: ReadonlySet<string>): TrackerReading => {
  const byFeed = caches.get(provider) ?? new WeakMap<object, Map<string, TrackerReading>>();
  caches.set(provider, byFeed);
  const readings = byFeed.get(feed) ?? new Map<string, TrackerReading>();
  byFeed.set(feed, readings);
  const key = [...assumed].sort().join('\n');
  const hit = readings.get(key);
  if (hit !== undefined) return hit;
  const reading = readTracker(provider, { ...feed, assumed });
  readings.set(key, reading);
  return reading;
};

export { readTrackerCached };
