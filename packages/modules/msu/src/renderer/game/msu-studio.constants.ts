/* @layer renderer-shell @kind constants */
import type { MsuSlotTitles } from './msu-studio-game.type';

const MUSIC_CHANNEL = 'music';

const DEFAULT_SLOT_TITLES: MsuSlotTitles = { base: 'Standard Slots', extended: 'Extended Slots' };

const DEFAULT_MAX_CROSSFADE_SECONDS = 10;

const DEFAULT_SOUND_FILTER_PLACEHOLDER = 'Filter sounds';

const MUSIC_LAYER_SLOTS = 3;

const SOUND_LAYER_SLOTS = 2;

const DEFAULT_EXTENDED_THRESHOLD = Number.POSITIVE_INFINITY;

export {
  DEFAULT_EXTENDED_THRESHOLD, DEFAULT_MAX_CROSSFADE_SECONDS, DEFAULT_SLOT_TITLES, DEFAULT_SOUND_FILTER_PLACEHOLDER,
  MUSIC_CHANNEL, MUSIC_LAYER_SLOTS, SOUND_LAYER_SLOTS,
};
