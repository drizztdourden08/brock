/* @layer renderer-shell @kind logic */
import type { PlacementSummary } from '../../../../contract/placement-summary.type';
import type { RunTile } from '../../dashboard/run-tile.type';

const counterTilesOf = (summary: PlacementSummary | null, names: Readonly<Record<string, string>> | undefined): RunTile[] =>
  (summary?.rows ?? []).map((row) => ({ label: names?.[row.label] ?? row.label, value: row.value }));

export { counterTilesOf };
