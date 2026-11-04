/* @layer core @kind types */
import type { MsuEngine, MusicCue } from '../types';

interface MsuSession<Ctx = unknown> {
  onMusicCue: (cue: MusicCue<Ctx>) => void;
  onGameSound: (channel: number, id: number, pan: number) => void;
  isPlaying: (cue: MusicCue<Ctx>) => boolean;
  onSoundTrace: (channel: number, id: number, pan: number, claimed: number) => void;
  onMusicTrace: (ctrl: number, scene: number, external: number) => void;
  dispose: () => void;
}

type EngineHolder<Ctx> = { engine: MsuEngine<Ctx> | null };

export type { EngineHolder, MsuSession };
