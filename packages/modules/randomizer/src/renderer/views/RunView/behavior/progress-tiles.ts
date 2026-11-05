/* @layer renderer-shell @kind logic */
import type { NetworkStatus } from '../../../../archipelago';
import type { RunTile } from '../../dashboard/run-tile.type';
import type { CheckCounts } from './check-counts.type';

const checkTilesOf = (counts: CheckCounts): RunTile[] => {
  const tiles: RunTile[] = [{ label: 'checks taken', value: `${counts.taken} of ${counts.total}` }];
  if (counts.available !== null) tiles.push({ label: 'available', value: String(counts.available) });
  if (counts.left !== null) tiles.push({ label: 'left', value: String(counts.left) });
  return tiles;
};

const roomTilesOf = (room: NetworkStatus['progress']): RunTile[] => [{ label: 'items received', value: String(room.received) }];

const progressTilesOf = (counts: CheckCounts | null, room: NetworkStatus['progress'] | null): RunTile[] => [
  ...(counts === null ? [] : checkTilesOf(counts)),
  ...(room === null ? [] : roomTilesOf(room)),
];

export { progressTilesOf };
