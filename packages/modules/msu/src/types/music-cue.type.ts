/* @layer core @kind types */
interface MusicCue<Ctx = unknown> {
  ctrl: number;
  scene: number;
  context: Ctx;
}

export type { MusicCue };
