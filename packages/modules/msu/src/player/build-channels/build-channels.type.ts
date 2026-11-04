/* @layer core @kind types */
import type { MsuSoundChannel } from '../../config';
import type { MsuPackManifest } from '../../types';
import type { SoundChannelApi } from '../channel';
import type { LoadBytes } from '../track-loader';

interface BuildChannelsParams {
  ctx: BaseAudioContext;
  musicOut: AudioNode;
  busOut: Record<MsuSoundChannel['bus'], AudioNode>;
  soundChannels: readonly MsuSoundChannel[];
  manifest: MsuPackManifest;
  loadBytes: LoadBytes;
  resumeEnabled?: () => boolean;
  onError?: (message: string) => void;
  onTrack?: (trackNum: number, layerCount: number, resumed: boolean) => void;
  onAmbient?: (soundId: number, layerCount: number, resumed: boolean) => void;
}

interface SoundEntry {
  config: MsuSoundChannel;
  api: SoundChannelApi;
}

interface BuiltChannels {
  music: SoundChannelApi;
  sounds: SoundEntry[];
}

export type { BuildChannelsParams, BuiltChannels };
