/* @layer renderer-shell @kind logic */
import type { ProcessMetric } from '@drizztdourden08/brock-core';
import type { StackedBarSegment } from '@drizztdourden08/tessera/primitives';
import { MAIN_WINDOW, MEMORY_GROUPS } from '../PerformanceWidget.constants';
import type { MemoryGroupId } from '../PerformanceWidget.type';

const groupOf = (metric: ProcessMetric): MemoryGroupId => {
  if (metric.type === 'Browser') return 'main';
  if (metric.type === 'GPU') return 'gpu';
  if (metric.type === 'Utility') return 'utility';
  if (metric.type === 'Tab' && metric.window === MAIN_WINDOW) return 'renderer';
  if (metric.type === 'Tab' && metric.window !== null) return 'widgets';
  return 'other';
};

const memorySegments = (processes: readonly ProcessMetric[]): StackedBarSegment[] => {
  const bytes = new Map<MemoryGroupId, number>();
  for (const metric of processes) {
    const group = groupOf(metric);
    bytes.set(group, (bytes.get(group) ?? 0) + metric.workingSetBytes);
  }
  return MEMORY_GROUPS.flatMap((group) => {
    const value = bytes.get(group.id) ?? 0;
    return value > 0 ? [{ id: group.id, label: group.label, value, color: group.color }] : [];
  });
};

export { memorySegments };
