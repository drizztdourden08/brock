/* @layer renderer-shell @kind constants */
import type { TitleBarItemEntry, TitleBarVolumeStrings } from './title-bar-item.type';

const NO_TITLE_BAR_ITEMS: readonly TitleBarItemEntry[] = [];

const VOLUME_STRINGS: TitleBarVolumeStrings = { mute: 'Mute', unmute: 'Unmute' };

const VOLUME_WAVE_STEP = 0.5;

export { NO_TITLE_BAR_ITEMS, VOLUME_STRINGS, VOLUME_WAVE_STEP };
