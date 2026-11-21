/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { RandomizerProfileConfig } from '../../../../augment';
import type { RunTile } from '../../dashboard/run-tile.type';
import { DEFAULT_SLOT, NO_VALUE, OFF_LABEL, ON_LABEL, TILE_LABELS as LABELS } from './summary-tiles.constants';

const summaryTilesOf = (
  profileName: string,
  config: RandomizerProfileConfig,
  modeLabel: string | undefined,
  text: (value: Text) => string,
): RunTile[] => {
  const tiles: RunTile[] = [
    { label: text(LABELS.profile), value: profileName },
    { label: text(LABELS.seed), value: config.seed },
    { label: text(LABELS.mode), value: modeLabel ?? config.mode },
  ];
  if (config.origin !== undefined) tiles.push({ label: text(LABELS.origin), value: config.origin });
  if (config.mode !== 'online') return tiles;
  return [
    ...tiles,
    { label: text(LABELS.server), value: config.serverUrl ?? text(NO_VALUE) },
    { label: text(LABELS.slot), value: config.slotName ?? text(DEFAULT_SLOT) },
    { label: text(LABELS.deathLink), value: config.deathLink ? text(ON_LABEL) : text(OFF_LABEL) },
  ];
};

export { summaryTilesOf };
