/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { hostApi } from '../../../../host/host-api';
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { ProcessFeed, ProcessSample } from '../PerformanceWidget.type';
import { processTotals } from './process-totals';
import { pushSeries } from './push-series';

const nextFeed = (feed: ProcessFeed | null, sample: ProcessSample): ProcessFeed => {
  const totals = processTotals(sample.data);
  return { sample, cpu: pushSeries(feed?.cpu, totals.cpuPercent), memory: pushSeries(feed?.memory, totals.memoryBytes) };
};

const useProcessSampler = (active: boolean, refreshMs: number): ProcessFeed | null => {
  const [feed, setFeed] = useState<ProcessFeed | null>(null);

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
        if (live) setFeed((current) => nextFeed(current, { data, ipcPerSecond }));
      } catch {
        if (live) setFeed(null);
      }
    };
    void poll();
    const timer = setInterval(() => void poll(), refreshMs);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [active, refreshMs]);

  return feed;
};

export { useProcessSampler };
