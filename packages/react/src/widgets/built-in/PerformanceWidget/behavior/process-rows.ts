/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { ProcessMetric, WidgetWindowSummary } from '@drizztdourden08/brock-core';
import { formatUnits } from '../../../../diagnostics/format-units';
import type { PerformanceRow, ProcessSample } from '../PerformanceWidget.type';
import { memoryShare } from './memory-share';
import { processTotals } from './process-totals';

const processRow = (metric: ProcessMetric): PerformanceRow => ({
  label: `${metric.name ?? metric.type} ${metric.pid}${metric.window === null ? '' : ` (${metric.window} window)`}`,
  value: `${metric.cpuPercent.toFixed(1)}% CPU, ${formatBytes(metric.workingSetBytes)}`,
});

const windowRow = (window: WidgetWindowSummary): PerformanceRow => ({
  label: `Widget window ${window.id}`,
  value: [window.visible ? 'shown' : 'hidden', window.sync ? 'synced' : 'independent', window.cluster > 1 ? `snapped with ${window.cluster - 1} more` : 'not snapped'].join(', '),
});

const processRows = (sample: ProcessSample | null): PerformanceRow[] => {
  if (!sample) return [{ label: 'Processes', value: 'no host process (browser preview)' }];
  const { data, ipcPerSecond } = sample;
  const { cpuPercent: cpu, memoryBytes: memory } = processTotals(data);
  return [
    { label: 'All processes', value: `${data.processes.length}, ${cpu.toFixed(1)}% CPU, ${formatBytes(memory)}` },
    { label: 'System memory', value: `${formatBytes(data.memoryTotalBytes)}, the app holds ${(memoryShare(memory, data.memoryTotalBytes) ?? 0).toFixed(1)}%` },
    { label: 'Main memory', value: `${formatBytes(data.main.rssBytes)} resident, heap ${formatBytes(data.main.heapUsedBytes)} of ${formatBytes(data.main.heapTotalBytes)}` },
    { label: 'Uptime', value: formatUnits.duration(data.uptimeSeconds) },
    { label: 'Windows', value: `${data.windowCount} (${data.widgetWindows.length} widget)` },
    { label: 'IPC calls', value: ipcPerSecond === null ? `${data.ipcCalls} total` : `${ipcPerSecond.toFixed(1)}/s, ${data.ipcCalls} total` },
    { label: 'Runtime', value: `Electron ${data.versions.electron}, Chrome ${data.versions.chrome}, Node ${data.versions.node}` },
    { label: 'GPU compositing', value: formatUnits.orDash(data.gpuFeatures.gpu_compositing) },
    ...data.processes.map(processRow),
    ...data.widgetWindows.map(windowRow),
  ];
};

export { processRows };
