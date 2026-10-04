/* @layer electron-main @kind logic */
import { totalmem } from 'os';
import { app, BrowserWindow } from 'electron';
import type { ProcessMetric as AppProcessMetric } from 'electron';
import type { ProcessDiagnostics, ProcessMetric, WidgetWindowSummary } from '@drizztdourden08/brock-core/types';
import { ipcCallCount } from '../ipc/ipc-call-count';
import { clusterOf } from '../widgets/cluster-of';
import { widgetWindowControl } from '../widgets/widget-window-control';
import { collectVersions } from './collect-versions';
import { KIB } from './collect-processes.constants';
import { readGpuFeatures } from './read-gpu-features';
import { windowProcesses } from './window-processes';

const toMetric = (metric: AppProcessMetric, windows: ReadonlyMap<number, string>): ProcessMetric => ({
  pid: metric.pid,
  type: metric.type,
  name: metric.name ?? metric.serviceName ?? null,
  cpuPercent: metric.cpu.percentCPUUsage,
  workingSetBytes: metric.memory.workingSetSize * KIB,
  privateBytes: typeof metric.memory.privateBytes === 'number' ? metric.memory.privateBytes * KIB : null,
  window: windows.get(metric.pid) ?? null,
});

const widgetWindows = (): WidgetWindowSummary[] => widgetWindowControl.list().map(({ id, visible }) => {
  const state = widgetWindowControl.stateOf(id);
  return { id, visible, sync: state?.sync ?? false, cluster: clusterOf(id).length };
});

const collectProcesses = (): ProcessDiagnostics => {
  const memory = process.memoryUsage();
  const windows = windowProcesses();
  return {
    processes: app.getAppMetrics().map((metric) => toMetric(metric, windows)),
    main: { rssBytes: memory.rss, heapUsedBytes: memory.heapUsed, heapTotalBytes: memory.heapTotal, externalBytes: memory.external },
    uptimeSeconds: process.uptime(),
    windowCount: BrowserWindow.getAllWindows().length,
    widgetWindows: widgetWindows(),
    ipcCalls: ipcCallCount.total,
    versions: collectVersions(),
    gpuFeatures: readGpuFeatures(),
    memoryTotalBytes: totalmem(),
  };
};

export { collectProcesses };
