/* @layer core @kind types */
interface RandomizerLogText {
  autoStart: (mode: string, seed: string) => string;
  armed: (summary: string) => string | null;
  rerollFailed: (message: string) => string;
}

export type { RandomizerLogText };
