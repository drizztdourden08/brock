/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../../../augment';
import type { RunTile } from '../../dashboard/run-tile.type';
import { DEFAULT_SLOT, NO_VALUE } from './summary-tiles.constants';

const summaryTilesOf = (profileName: string, config: RandomizerProfileConfig, modeLabel: string | undefined): RunTile[] => {
  const tiles: RunTile[] = [
    { label: 'profile', value: profileName },
    { label: 'seed', value: config.seed },
    { label: 'mode', value: modeLabel ?? config.mode },
  ];
  if (config.origin !== undefined) tiles.push({ label: 'origin', value: config.origin });
  if (config.mode !== 'online') return tiles;
  return [
    ...tiles,
    { label: 'server', value: config.serverUrl ?? NO_VALUE },
    { label: 'slot', value: config.slotName ?? DEFAULT_SLOT },
    { label: 'death link', value: config.deathLink ? 'on' : 'off' },
  ];
};

export { summaryTilesOf };
