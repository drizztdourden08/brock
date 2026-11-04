/* @layer renderer-shell @kind hook */
import type { TrackerReading } from '../../../../tracker';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { initialAssumed } from '../../feed/initial-assumed';
import { readTrackerCached } from '../read-tracker-cached';
import { useTrackerFeed } from './useTrackerFeed';

const useTrackerReading = (assumed?: readonly string[]): TrackerReading | null => {
  const tracker = useRandomizerGame()?.tracker;
  const feed = useTrackerFeed();
  if (tracker === undefined || feed === null) return null;
  return readTrackerCached(tracker, feed, assumed === undefined ? initialAssumed(tracker) : new Set(assumed));
};

export { useTrackerReading };
