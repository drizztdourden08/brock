/* @layer renderer-shell @kind logic */
import type { SoundPanelController } from '../msu.type';
import type { OpenEffect } from './effects-panel.type';

const openEffectOf = (
  channels: readonly [string, string],
  first: SoundPanelController,
  second: SoundPanelController,
): OpenEffect | null => {
  if (first.openSound !== null) return { channel: channels[0], soundId: first.openSound };
  if (second.openSound !== null) return { channel: channels[1], soundId: second.openSound };
  return null;
};

export { openEffectOf };
