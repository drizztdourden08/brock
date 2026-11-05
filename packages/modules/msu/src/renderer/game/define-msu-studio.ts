/* @layer renderer-shell @kind logic */
import { defaultDebugChannels } from './default-debug-channels';
import { missingTabChannel } from './missing-tab-channel';
import {
  DEFAULT_EXTENDED_THRESHOLD, DEFAULT_MAX_CROSSFADE_SECONDS, DEFAULT_SLOT_TITLES, DEFAULT_SOUND_FILTER_PLACEHOLDER,
} from './msu-studio.constants';
import type { MsuStudioGameInput } from './msu-studio-game-input.type';
import type { MsuStudioGame } from './msu-studio-game.type';

const defineMsuStudio = <Ctx = unknown, Target = unknown>(
  input: MsuStudioGameInput<Ctx, Target>,
): MsuStudioGame<Ctx, Target> => {
  const soundTabs = input.soundTabs ?? [];
  const missing = missingTabChannel(input.config, soundTabs);
  if (missing !== undefined) throw new Error(`MSU studio "${input.config.id}": sound tab channel "${missing}" is not a sound channel of the game`);
  const channelLabels = input.channelLabels ?? {};
  return {
    ...input,
    soundTabs,
    channelLabels,
    channelTags: input.channelTags ?? {},
    extendedTracks: input.extendedTracks ?? new Set(),
    extendedThreshold: input.extendedThreshold ?? DEFAULT_EXTENDED_THRESHOLD,
    slotTitles: input.slotTitles ?? DEFAULT_SLOT_TITLES,
    soundFilterPlaceholder: input.soundFilterPlaceholder ?? DEFAULT_SOUND_FILTER_PLACEHOLDER,
    maxCrossfadeSeconds: input.maxCrossfadeSeconds ?? DEFAULT_MAX_CROSSFADE_SECONDS,
    debug: defaultDebugChannels(input.config, channelLabels, input.debug),
  };
};

export { defineMsuStudio };
