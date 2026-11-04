/* @layer core @kind types */
interface ProbedAudio {
  durationSeconds: number | null;
  sampleRate: number | null;
  channels: number | null;
  bitRate: number | null;
}

type AudioProbe = (dataPath: string) => Promise<ProbedAudio | null>;

export type { AudioProbe, ProbedAudio };
