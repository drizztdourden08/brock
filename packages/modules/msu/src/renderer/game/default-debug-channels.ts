/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../config';
import type { MsuDebugChannels } from './msu-debug-channels.type';
import { MUSIC_CHANNEL, MUSIC_LAYER_SLOTS, SOUND_LAYER_SLOTS } from './msu-studio.constants';

const titleOf = (channel: string, labels: Record<string, string>): string =>
  labels[channel] ?? channel.charAt(0).toUpperCase() + channel.slice(1);

const defaultDebugChannels = <Ctx = unknown>(
  config: MsuGameConfig<Ctx>, labels: Record<string, string>, given: Partial<MsuDebugChannels> = {},
): MsuDebugChannels => {
  const channels = given.channels ?? [MUSIC_CHANNEL, ...config.soundChannels.map((channel) => channel.name)];
  return {
    channels,
    titles: given.titles ?? Object.fromEntries(channels.map((channel) => [channel, titleOf(channel, labels)])),
    layerSlots: given.layerSlots
      ?? Object.fromEntries(channels.map((channel) => [channel, channel === MUSIC_CHANNEL ? MUSIC_LAYER_SLOTS : SOUND_LAYER_SLOTS])),
  };
};

export { defaultDebugChannels };
