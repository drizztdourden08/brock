/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PlacementSummary } from '../../../../contract/placement-summary.type';
import type { RunTile } from '../../dashboard/run-tile.type';

const counterTilesOf = (
  summary: PlacementSummary | null,
  names: Readonly<Record<string, Text>> | undefined,
  text: (value: Text) => string,
): RunTile[] =>
  (summary?.rows ?? []).map((row) => {
    const name = names?.[row.label];
    return { label: name === undefined ? row.label : text(name), value: row.value };
  });

export { counterTilesOf };
