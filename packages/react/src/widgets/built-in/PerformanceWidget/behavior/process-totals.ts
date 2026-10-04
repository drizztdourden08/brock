/* @layer renderer-shell @kind logic */
import type { ProcessDiagnostics } from '@drizztdourden08/brock-core';
import type { ProcessTotals } from '../PerformanceWidget.type';

const processTotals = (data: ProcessDiagnostics): ProcessTotals => ({
  cpuPercent: data.processes.reduce((sum, metric) => sum + metric.cpuPercent, 0),
  memoryBytes: data.processes.reduce((sum, metric) => sum + metric.workingSetBytes, 0),
});

export { processTotals };
