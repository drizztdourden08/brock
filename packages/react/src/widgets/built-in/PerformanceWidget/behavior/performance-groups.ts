/* @layer renderer-shell @kind logic */
import { PERFORMANCE_SECTIONS } from '../PerformanceWidget.constants';
import type { AppFacts, PerformanceGroup, PerformanceRow, PerformanceSectionId, ProcessSample, RendererSample } from '../PerformanceWidget.type';
import { appRows } from './app-rows';
import { processRows } from './process-rows';
import { rendererRows } from './renderer-rows';

const performanceGroups = (
  shown: readonly PerformanceSectionId[],
  renderer: RendererSample | null,
  processes: ProcessSample | null,
  facts: AppFacts,
): PerformanceGroup[] => {
  const rowsOf: Record<PerformanceSectionId, () => PerformanceRow[]> = {
    renderer: () => rendererRows(renderer),
    processes: () => processRows(processes),
    app: () => appRows(facts),
  };
  return PERFORMANCE_SECTIONS.filter((section) => shown.includes(section.id)).map((section) => ({ id: section.id, title: section.label, rows: rowsOf[section.id]() }));
};

export { performanceGroups };
