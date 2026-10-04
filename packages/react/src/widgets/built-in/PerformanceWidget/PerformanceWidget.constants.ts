/* @layer renderer-shell @kind constants */
import type { GaugeThresholds, SegmentOption, SparklineBand } from '@drizztdourden08/tessera/primitives';
import type { MemoryGroup, PerformanceSectionChoice, PerformanceSectionId } from './PerformanceWidget.type';

const PERFORMANCE_WIDGET_ID = 'performance';
const REFRESH_PREF = 'refreshMs';
const SECTIONS_PREF = 'sections';
const DETAILS_PREF = 'detailsOpen';
const DEFAULT_REFRESH_MS = 1000;
const LAG_PROBE_MS = 100;
const MS_PER_SECOND = 1000;
const SNAPSHOT_TITLE = 'Performance snapshot';
const HISTORY_LENGTH = 60;
const SPARK_MIN_LENGTH = 12;
const CPU_FLOOR = 10;
const LAG_FLOOR = 16;
const MEMORY_MARGIN = 0.05;
const MAIN_WINDOW = 'main';
const NO_SAMPLES: readonly number[] = [];
const EMPTY_VALUE = '-';
const PERCENT = 100;
const LOW_FPS = 30;
const GAUGE_DIALS = { md: 80, lg: 128 } as const;
const LAG_THRESHOLDS: GaugeThresholds = { warning: 50, danger: 200 };
const CPU_THRESHOLDS: GaugeThresholds = { warning: 60, danger: 85 };
const MEMORY_THRESHOLDS: GaugeThresholds = { warning: 25, danger: 50 };
const LOW_FPS_BAND: SparklineBand = { from: 0, to: LOW_FPS, tone: 'danger' };
const LAG_BAND: SparklineBand = { from: LAG_THRESHOLDS.warning, tone: 'warning' };
const STILL = { fps: 1, cpu: 0.1, lag: 0.5, memoryBytes: 512 * 1024 } as const;

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

const MEMORY_GROUPS: readonly MemoryGroup[] = [
  { id: 'main', label: 'Main', color: 'blue' },
  { id: 'renderer', label: 'Renderer', color: 'primary' },
  { id: 'gpu', label: 'GPU', color: 'teal' },
  { id: 'utility', label: 'Utility', color: 'amber' },
  { id: 'widgets', label: 'Widget windows', color: 'violet' },
  { id: 'other', label: 'Other', color: 'neutral' },
];

export {
  CPU_FLOOR, CPU_THRESHOLDS, DEFAULT_REFRESH_MS, DEFAULT_SECTIONS, DETAILS_PREF, EMPTY_VALUE, GAUGE_DIALS, HISTORY_LENGTH, LAG_BAND, LAG_FLOOR, LAG_PROBE_MS, LAG_THRESHOLDS, LOW_FPS, LOW_FPS_BAND, MAIN_WINDOW, MEMORY_GROUPS,
  MEMORY_MARGIN, MEMORY_THRESHOLDS, MS_PER_SECOND, NO_SAMPLES, PERCENT, PERFORMANCE_SECTIONS, PERFORMANCE_WIDGET_ID, REFRESH_CHOICES, REFRESH_PREF, SECTIONS_PREF, SNAPSHOT_TITLE, SPARK_MIN_LENGTH, STILL,
};
