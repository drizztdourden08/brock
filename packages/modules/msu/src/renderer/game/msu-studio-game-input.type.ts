/* @layer renderer-shell @kind types */
import type { MsuDebugChannels } from './msu-debug-channels.type';
import type { MsuStudioGame } from './msu-studio-game.type';

type MsuStudioDefaulted =
  | 'slotTitles' | 'soundTabs' | 'channelLabels' | 'channelTags' | 'extendedTracks' | 'extendedThreshold'
  | 'soundFilterPlaceholder' | 'maxCrossfadeSeconds' | 'debug';

type MsuStudioGameInput<Ctx = unknown, Target = unknown> =
  Omit<MsuStudioGame<Ctx, Target>, MsuStudioDefaulted>
  & Partial<Pick<MsuStudioGame<Ctx, Target>, Exclude<MsuStudioDefaulted, 'debug'>>>
  & { debug?: Partial<MsuDebugChannels> };

export type { MsuStudioGameInput };
