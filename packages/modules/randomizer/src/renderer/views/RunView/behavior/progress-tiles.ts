/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import type { NetworkStatus } from '../../../../archipelago';
import type { RunTile } from '../../dashboard/run-tile.type';
import type { CheckCounts } from './check-counts.type';
import { TILE_LABELS } from './progress-tiles.constants';

type Resolve = (value: Text) => string;

const checkTilesOf = (counts: CheckCounts, text: Resolve): RunTile[] => {
  const taken = text(msg('randomizer:run.progress.takenOf', { taken: counts.taken, total: counts.total }));
  const tiles: RunTile[] = [{ label: text(TILE_LABELS.taken), value: taken }];
  if (counts.available !== null) tiles.push({ label: text(TILE_LABELS.available), value: String(counts.available) });
  if (counts.left !== null) tiles.push({ label: text(TILE_LABELS.left), value: String(counts.left) });
  return tiles;
};

const roomTilesOf = (room: NetworkStatus['progress'], text: Resolve): RunTile[] => [
  { label: text(TILE_LABELS.received), value: String(room.received) },
];

const progressTilesOf = (counts: CheckCounts | null, room: NetworkStatus['progress'] | null, text: Resolve): RunTile[] => [
  ...(counts === null ? [] : checkTilesOf(counts, text)),
  ...(room === null ? [] : roomTilesOf(room, text)),
];

export { progressTilesOf };
