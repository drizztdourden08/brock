/* @layer renderer-shell @kind types */
import type { MsuGameConfig } from '../../config';
import type { MsuDebugChannels } from './msu-debug-channels.type';
import type { MsuSoundSource } from './msu-game-sound.type';
import type { MsuPreviewBinding } from './msu-preview-binding.type';
import type { MsuSoundTab } from './msu-sound-tab.type';

interface MsuSlotTitles {
  base: string;
  extended: string;
}

interface MsuStudioGame<Ctx = unknown, Target = unknown> {
  config: MsuGameConfig<Ctx>;
  trackName: (trackNum: number) => string;
  baseTrackCount: number;
  extendedTracks: ReadonlySet<number>;
  extendedThreshold: number;
  slotTitles: MsuSlotTitles;
  soundTabs: readonly MsuSoundTab[];
  channelLabels: Record<string, string>;
  channelTags: Record<string, string>;
  sounds: MsuSoundSource;
  soundFilterPlaceholder: string;
  maxCrossfadeSeconds: number;
  preview?: MsuPreviewBinding<Target>;
  debug: MsuDebugChannels;
}

export type { MsuSlotTitles, MsuStudioGame };
