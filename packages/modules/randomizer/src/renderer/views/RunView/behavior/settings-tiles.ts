/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../../../augment';
import type { RunTile } from '../../dashboard/run-tile.type';

const MAX_SETTING_TILES = 12;

const isPlain = (value: unknown): value is string | number | boolean =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const settingTilesOf = (config: RandomizerProfileConfig): RunTile[] =>
  Object.entries(config.options as Record<string, unknown>)
    .filter(([, value]) => isPlain(value))
    .slice(0, MAX_SETTING_TILES)
    .map(([label, value]) => ({ label, value: String(value) }));

export { settingTilesOf };
