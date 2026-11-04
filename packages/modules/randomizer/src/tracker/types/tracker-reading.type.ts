/* @layer core @kind types */
import type { World } from '../../world';
import type { LocationStatus } from './location-status.type';
import type { TrackerCounts } from './tracker-counts.type';

interface TrackerReading {
  world: World;
  statuses: ReadonlyMap<string, LocationStatus>;
  reachableRegions: ReadonlySet<string>;
  counts: TrackerCounts;
}

export type { TrackerReading };
