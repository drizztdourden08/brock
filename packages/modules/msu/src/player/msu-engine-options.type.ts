/* @layer core @kind types */
import type { MsuGameConfig } from '../config';
import type { MsuPackManifest } from '../types';
import type { LoadBytes } from './track-loader';

interface MsuEngineOptions<Ctx = unknown> {
  ctx: BaseAudioContext;
  destination: AudioNode;
  manifest: MsuPackManifest;
  loadBytes: LoadBytes;
  config: MsuGameConfig<Ctx>;
  variant?: string;
  musicVolume: () => number;
  sfxVolume?: () => number;
  ambientVolume?: () => number;
  resumeEnabled?: () => boolean;
  resetAtTitle?: () => boolean;
  onError?: (message: string) => void;
  onReset?: () => void;
  onTrack?: (trackNum: number, layerCount: number, resumed: boolean) => void;
  onAmbient?: (soundId: number, layerCount: number, resumed: boolean) => void;
}

export type { MsuEngineOptions };
