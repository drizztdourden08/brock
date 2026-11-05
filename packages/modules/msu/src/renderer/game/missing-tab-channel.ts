/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../config';
import type { MsuSoundTab } from './msu-sound-tab.type';

const missingTabChannel = (config: MsuGameConfig, tabs: readonly MsuSoundTab[]): string | undefined => {
  const known = new Set(config.soundChannels.map((channel) => channel.name));
  return tabs.flatMap((tab) => tab.channels).find((channel) => !known.has(channel));
};

export { missingTabChannel };
