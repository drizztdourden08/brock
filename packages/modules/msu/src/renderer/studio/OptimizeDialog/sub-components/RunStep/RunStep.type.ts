/* @layer renderer-shell @kind types */
import type { OptimizeProgress, OptimizeRunResult } from '../../../../../optimize';

interface RunStepProps {
  progress: OptimizeProgress | null;
  result: OptimizeRunResult | null;
}

export type { RunStepProps };
