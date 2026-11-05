/* @layer electron-main @kind types */
import type { OptimizeConversion, OptimizeProgress } from '../../optimize';
import type { OptimizeEnv } from './optimize-env.type';

interface ConvertRequest {
  env: OptimizeEnv;
  step: OptimizeProgress;
  sizeBytes: number;
  taken: ReadonlySet<string>;
}

type ConvertOutcome =
  | { ok: true; conversion: OptimizeConversion }
  | { ok: false; failure: { name: string; reason: string } };

export type { ConvertOutcome, ConvertRequest };
