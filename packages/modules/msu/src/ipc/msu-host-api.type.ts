/* @layer core @kind types */
import type { ProbedAudio } from '../audio-probe';
import type { OptimizeAnalysis, OptimizeProgress, OptimizeRunResult } from '../optimize';

type MsuHostApi = {
  readMsul: (filePath: string) => Promise<ArrayBuffer>;
  measureOptimize: (packName: string) => Promise<OptimizeAnalysis>;
  runOptimize: (packName: string, fileNames: string[]) => Promise<OptimizeRunResult>;
  onOptimizeProgress: (listener: (progress: OptimizeProgress) => void) => () => void;
  probeAudio: (dataPath: string) => Promise<ProbedAudio | null>;
};

export type { MsuHostApi };
