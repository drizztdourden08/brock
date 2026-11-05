/* @layer core @kind logic */
import { DEFAULT_SLOT_NAME } from './player-yaml.constants';
import { renderPlayerYaml } from './render-player-yaml';
import type { PlayerFile, PlayerFileInput } from './player-yaml.type';

const playerFileOf = (input: PlayerFileInput): PlayerFile => {
  const typed = input.slotName?.trim() ?? '';
  const slotName = typed === '' ? DEFAULT_SLOT_NAME : typed;
  const appVersion = input.appVersion === undefined || input.appVersion === '' ? undefined : input.appVersion;
  return { slotName, yaml: renderPlayerYaml({ ...input, slotName, appVersion }) };
};

export { playerFileOf };
