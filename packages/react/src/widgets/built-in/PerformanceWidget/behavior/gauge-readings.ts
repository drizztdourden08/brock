/* @layer renderer-shell @kind logic */
import type { GaugeReadings, PerformanceSectionId, ProcessSample, RendererSample } from '../PerformanceWidget.type';
import { memoryShare } from './memory-share';
import { processTotals } from './process-totals';

const heapShare = (sample: RendererSample | null): number | null => {
  const used = sample?.heapUsedBytes ?? null;
  return used === null ? null : memoryShare(used, sample?.heapLimitBytes ?? null);
};

const gaugeReadings = (renderer: RendererSample | null, processes: ProcessSample | null, shown: readonly PerformanceSectionId[]): GaugeReadings => {
  const totals = processes && shown.includes('processes') ? processTotals(processes.data) : null;
  return {
    cpu: totals?.cpuPercent ?? null,
    memory: totals && processes ? memoryShare(totals.memoryBytes, processes.data.memoryTotalBytes) : null,
    heap: shown.includes('renderer') ? heapShare(renderer) : null,
  };
};

export { gaugeReadings };
