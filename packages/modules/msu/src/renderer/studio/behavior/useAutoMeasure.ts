/* @layer renderer-shell @kind hook */
import { useCallback, useEffect } from 'react';
import { msuApi } from '../../msu-api';
import { optimizeMessage } from './optimize-message';
import type { AutoMeasureParams } from './auto-measure.type';

const useAutoMeasure = (params: AutoMeasureParams) => {
  const { open, pack, step, toolState, setStep, setAnalysis, setProgress, setError } = params;

  const measure = useCallback(async (): Promise<void> => {
    setStep('measuring');
    setProgress(null);
    setError(null);
    try {
      const api = msuApi();
      if (api === null) throw new Error('Could not measure this pack.');
      setAnalysis(await api.measureOptimize(pack));
      setStep('preview');
    } catch (err) {
      setError(optimizeMessage(err, 'Could not measure this pack.'));
      setStep('error');
    }
  }, [pack, setStep, setProgress, setError, setAnalysis]);

  useEffect(() => {
    if (!open || toolState === null) return;
    if (step !== 'checking' && step !== 'tool') return;
    if (toolState.status === 'ready') void measure();
    else if (step === 'checking') setStep('tool');
  }, [open, step, toolState, measure, setStep]);

  return measure;
};

export { useAutoMeasure };
