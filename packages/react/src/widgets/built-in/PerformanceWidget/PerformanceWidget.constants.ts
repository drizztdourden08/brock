/* @layer renderer-shell @kind constants */
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { PerformanceSectionChoice, PerformanceSectionId } from './PerformanceWidget.type';

const PERFORMANCE_WIDGET_ID = 'performance';
const REFRESH_PREF = 'refreshMs';
const SECTIONS_PREF = 'sections';
const DEFAULT_REFRESH_MS = 1000;
const LAG_PROBE_MS = 100;
const MS_PER_SECOND = 1000;
const SNAPSHOT_TITLE = 'Performance snapshot';

const REFRESH_CHOICES: SegmentOption[] = [
  { value: '500', label: '0.5 s' },
  { value: '1000', label: '1 s' },
  { value: '2000', label: '2 s' },
  { value: '5000', label: '5 s' },
];

const PERFORMANCE_SECTIONS: readonly PerformanceSectionChoice[] = [
  { id: 'renderer', label: 'Renderer' },
  { id: 'processes', label: 'Processes' },
  { id: 'app', label: 'App' },
];

const DEFAULT_SECTIONS: readonly PerformanceSectionId[] = PERFORMANCE_SECTIONS.map((section) => section.id);

export {
  DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, LAG_PROBE_MS, MS_PER_SECOND, PERFORMANCE_SECTIONS, PERFORMANCE_WIDGET_ID, REFRESH_CHOICES, REFRESH_PREF, SECTIONS_PREF, SNAPSHOT_TITLE,
};
