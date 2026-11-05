/* @layer electron-main @kind types */
import type { OptimizeProgress } from '../../optimize';
import type { EncoderTools } from '../encoder/encoder-tools.type';
import type { PackEnv } from '../pack-fs';

type ProgressReporter = (progress: OptimizeProgress) => void;

interface OptimizeEnv extends PackEnv, EncoderTools {
  report: ProgressReporter;
}

export type { OptimizeEnv };
