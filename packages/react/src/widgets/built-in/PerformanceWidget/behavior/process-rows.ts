/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { ProcessMetric, WidgetWindowSummary } from '@drizztdourden08/brock-core';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { formatUnits } from '../../../../diagnostics/format-units';
import type { PerformanceRow, ProcessSample } from '../PerformanceWidget.type';
import { memoryShare } from './memory-share';
import { processTotals } from './process-totals';

const processRow = (metric: ProcessMetric, t: I18n['t']): PerformanceRow => {
  const name = metric.name ?? metric.type;
  const pid = String(metric.pid);
  return {
    label: metric.window === null ? t('brock-app:perf.process.label', { name, pid }) : t('brock-app:perf.process.labelWindow', { name, pid, window: metric.window }),
    value: t('brock-app:perf.process.value', { cpu: metric.cpuPercent.toFixed(1), memory: formatBytes(metric.workingSetBytes) }),
  };
};

const windowRow = (window: WidgetWindowSummary, t: I18n['t']): PerformanceRow => ({
  label: t('brock-app:perf.window.label', { id: String(window.id) }),
  value: t('brock-app:perf.window.value', { visible: String(window.visible), sync: String(window.sync), others: window.cluster > 1 ? window.cluster - 1 : 0 }),
});

const processRows = (sample: ProcessSample | null, t: I18n['t']): PerformanceRow[] => {
  if (!sample) return [{ label: t('brock-app:perf.section.processes'), value: t('brock-app:perf.value.noHost') }];
  const { data, ipcPerSecond } = sample;
  const { cpuPercent: cpu, memoryBytes: memory } = processTotals(data);
  const total = String(data.ipcCalls);
  return [
    { label: t('brock-app:perf.row.allProcesses'), value: t('brock-app:perf.value.allProcesses', { count: String(data.processes.length), cpu: cpu.toFixed(1), memory: formatBytes(memory) }) },
    { label: t('brock-app:perf.row.systemMemory'), value: t('brock-app:perf.value.systemMemory', { total: formatBytes(data.memoryTotalBytes), share: (memoryShare(memory, data.memoryTotalBytes) ?? 0).toFixed(1) }) },
    { label: t('brock-app:perf.row.mainMemory'), value: t('brock-app:perf.value.mainMemory', { rss: formatBytes(data.main.rssBytes), used: formatBytes(data.main.heapUsedBytes), limit: formatBytes(data.main.heapTotalBytes) }) },
    { label: t('brock-app:perf.row.uptime'), value: formatUnits.duration(data.uptimeSeconds) },
    { label: t('brock-app:perf.row.windows'), value: t('brock-app:perf.value.windows', { count: String(data.windowCount), widgets: String(data.widgetWindows.length) }) },
    { label: t('brock-app:perf.row.ipc'), value: ipcPerSecond === null ? t('brock-app:perf.value.ipcTotal', { total }) : t('brock-app:perf.value.ipcRate', { rate: ipcPerSecond.toFixed(1), total }) },
    { label: t('brock-app:perf.row.runtime'), value: t('brock-app:perf.value.runtime', { electron: data.versions.electron, chrome: data.versions.chrome, node: data.versions.node }) },
    { label: t('brock-app:perf.row.gpu'), value: formatUnits.orDash(data.gpuFeatures.gpu_compositing) },
    ...data.processes.map((metric) => processRow(metric, t)),
    ...data.widgetWindows.map((window) => windowRow(window, t)),
  ];
};

export { processRows };
