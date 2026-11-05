/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useTool } from '@drizztdourden08/brock-tools/renderer';
import type { OptimizeAnalysis, OptimizeProgress, OptimizeRunResult } from '../../../optimize';
import { msuApi } from '../../msu-api';
import { optimizeMessage } from '../behavior/optimize-message';
import { useAutoMeasure } from '../behavior/useAutoMeasure';
import { ENCODER_TOOL_ID } from './optimize.constants';
import type { OptimizeParams, OptimizeStep } from './optimize.type';

const convertibleNames = (analysis: OptimizeAnalysis | null): string[] =>
  (analysis?.candidates ?? []).filter((row) => row.excludedBecause === null).map((row) => row.name);

const useOptimize = (params: OptimizeParams) => {
  const { pack, open, onRunSettled } = params;
  const tool = useTool(ENCODER_TOOL_ID);
  const { refresh } = tool;
  const [step, setStep] = useState<OptimizeStep>('checking');
  const [analysis, setAnalysis] = useState<OptimizeAnalysis | null>(null);
  const [progress, setProgress] = useState<OptimizeProgress | null>(null);
  const [result, setResult] = useState<OptimizeRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) { void refresh(); return; }
    setStep('checking');
    setAnalysis(null);
    setProgress(null);
    setResult(null);
    setError(null);
  }, [open, refresh]);

  useEffect(() => (open ? msuApi()?.onOptimizeProgress(setProgress) : undefined), [open]);

  const measure = useAutoMeasure({ open, pack, step, toolState: tool.state, setStep, setAnalysis, setProgress, setError });

  const convert = useCallback(async (): Promise<void> => {
    const names = convertibleNames(analysis);
    const api = msuApi();
    if (names.length === 0 || api === null) return;
    setStep('converting');
    setProgress(null);
    setError(null);
    try {
      setResult(await api.runOptimize(pack, names));
      setStep('result');
    } catch (err) {
      setError(optimizeMessage(err, 'Could not convert this pack.'));
      setStep('error');
    } finally {
      onRunSettled();
    }
  }, [analysis, pack, onRunSettled]);

  return {
    step,
    tool,
    analysis,
    progress,
    result,
    error,
    convertibleCount: convertibleNames(analysis).length,
    convert,
    retry: measure,
  };
};

export { useOptimize };
