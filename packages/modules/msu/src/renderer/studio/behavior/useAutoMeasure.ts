/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback, useEffect } from 'react';
import { msuApi } from '../../msu-api';
import { optimizeMessage } from './optimize-message';
import type { AutoMeasureParams } from './auto-measure.type';

const useAutoMeasure = (params: AutoMeasureParams) => {
  const t = useT();
  const { open, pack, step, toolState, setStep, setAnalysis, setProgress, setError } = params;

  const measure = useCallback(async (): Promise<void> => {
    setStep('measuring');
    setProgress(null);
    setError(null);
    try {
      const api = msuApi();
      if (api === null) throw new Error(t('msu:optimize.measureFailed'));
      setAnalysis(await api.measureOptimize(pack));
      setStep('preview');
    } catch (err) {
      setError(optimizeMessage(err, t('msu:optimize.measureFailed')));
      setStep('error');
    }
  }, [pack, t, setStep, setProgress, setError, setAnalysis]);

  useEffect(() => {
    if (!open || toolState === null) return;
    if (step !== 'checking' && step !== 'tool') return;
    if (toolState.status === 'ready') void measure();
    else if (step === 'checking') setStep('tool');
  }, [open, step, toolState, measure, setStep]);

  return measure;
};

export { useAutoMeasure };
