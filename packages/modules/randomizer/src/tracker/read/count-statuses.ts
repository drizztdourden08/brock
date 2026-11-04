/* @layer core @kind logic */
import type { LocationStatus } from '../types/location-status.type';
import type { TrackerCounts } from '../types/tracker-counts.type';

const countStatuses = (
  statuses: ReadonlyMap<string, LocationStatus>, keep: (location: string) => boolean = () => true,
): TrackerCounts => {
  const counts: TrackerCounts = { checked: 0, available: 0, blocked: 0, total: 0 };
  for (const [location, status] of statuses) {
    if (!keep(location)) continue;
    counts[status] += 1;
    counts.total += 1;
  }
  return counts;
};

export { countStatuses };
