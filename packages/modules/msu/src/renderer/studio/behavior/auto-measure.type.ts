/* @layer renderer-shell @kind types */
import type { useTool } from '@drizztdourden08/brock-tools/renderer';
import type { OptimizeAnalysis, OptimizeProgress } from '../../../optimize';
import type { OptimizeStep } from '../OptimizeDialog/behavior/optimize.type';

type AutoMeasureParams = {
  open: boolean;
  pack: string;
  step: OptimizeStep;
  toolState: ReturnType<typeof useTool>['state'];
  setStep: (step: OptimizeStep) => void;
  setAnalysis: (analysis: OptimizeAnalysis) => void;
  setProgress: (progress: OptimizeProgress | null) => void;
  setError: (error: string | null) => void;
};

export type { AutoMeasureParams };
