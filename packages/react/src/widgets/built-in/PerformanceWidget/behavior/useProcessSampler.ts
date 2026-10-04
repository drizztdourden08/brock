/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { hostApi } from '../../../../host/host-api';
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { ProcessSample } from '../PerformanceWidget.type';

const useProcessSampler = (active: boolean, refreshMs: number): ProcessSample | null => {
  const [sample, setSample] = useState<ProcessSample | null>(null);

  useEffect(() => {
    const api = hostApi();
    if (!active || !api) return undefined;
    let live = true;
    let previous: { calls: number; at: number } | null = null;
    const poll = async (): Promise<void> => {
      try {
        const data = await api.getProcessDiagnostics();
        const at = performance.now();
        const ipcPerSecond = previous && at > previous.at ? ((data.ipcCalls - previous.calls) * MS_PER_SECOND) / (at - previous.at) : null;
        previous = { calls: data.ipcCalls, at };
        if (live) setSample({ data, ipcPerSecond });
      } catch {
        if (live) setSample(null);
      }
    };
    void poll();
    const timer = setInterval(() => void poll(), refreshMs);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [active, refreshMs]);

  return sample;
};

export { useProcessSampler };
