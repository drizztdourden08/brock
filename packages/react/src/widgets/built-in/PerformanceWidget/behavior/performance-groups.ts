/* @layer renderer-shell @kind logic */
import { FALLBACK_I18N } from '../../../../i18n/i18n-context.constants';
import { PERFORMANCE_SECTIONS } from '../PerformanceWidget.constants';
import type { PerformanceGroup, PerformanceGroupsInput, PerformanceRow, PerformanceSectionId } from '../PerformanceWidget.type';
import { appRows } from './app-rows';
import { processRows } from './process-rows';
import { rendererRows } from './renderer-rows';

const performanceGroups = ({ shown, renderer, processes, facts, i18n = FALLBACK_I18N }: PerformanceGroupsInput): PerformanceGroup[] => {
  const rowsOf: Record<PerformanceSectionId, () => PerformanceRow[]> = {
    renderer: () => rendererRows(renderer, i18n.t),
    processes: () => processRows(processes, i18n.t),
    app: () => appRows(facts, i18n.t),
  };
  return PERFORMANCE_SECTIONS.filter((section) => shown.includes(section.id)).map((section) => ({ id: section.id, title: i18n.text(section.label), rows: rowsOf[section.id]() }));
};

export { performanceGroups };
