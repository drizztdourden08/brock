/* @layer core @kind types */
import type { MsuSoundChannel } from './msu-sound-channel.type';
import type { MusicCommand } from './music-command.type';

interface MsuGameConfig<Ctx = unknown> {
  id: string;
  packRoot: string;
  soundChannels: readonly MsuSoundChannel[];
  soundIdCount: number;
  trackLoops: (track: number) => boolean;
  classifyMusic: (ctrl: number) => MusicCommand;
  musicLabels?: Readonly<Record<number, string>>;
  isTitleScene?: (scene: number) => boolean;
  variants?: Record<string, { remapTrack: (track: number, ctx: Ctx) => number }>;
  resumePath: (profile: string, slotKind: string, slotId: string | number) => string;
}

export type { MsuGameConfig };
