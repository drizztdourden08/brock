/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import { MUSIC_PREVIEW_SECONDS, MUSIC_TARGET } from './original-sound.constants';

const previewSeconds = (config: MsuGameConfig<never>, target: string): number | null => {
  if (target === MUSIC_TARGET) return MUSIC_PREVIEW_SECONDS;
  return config.soundChannels.find((channel) => channel.name === target)?.previewSeconds ?? null;
};

export { previewSeconds };
