/* @layer core @kind types */
interface SoundingVoice {
  fileName: string | null;
  positionSeconds: number;
  durationSeconds: number;
  loopSeconds: number | null;
  fade: { kind: 'in' | 'out'; remainingSeconds: number; totalSeconds: number } | null;
}

export type { SoundingVoice };
