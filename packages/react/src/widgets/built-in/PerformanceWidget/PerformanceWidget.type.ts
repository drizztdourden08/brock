/* @layer renderer-shell @kind types */
import type { ProcessDiagnostics } from '@drizztdourden08/brock-core';
import type { StackedBarColor, StatTrend, StatTrendMeaning } from '@drizztdourden08/tessera/composites';
import type { SparklineProps, StatusTone } from '@drizztdourden08/tessera/primitives';

type PerformanceSectionId = 'renderer' | 'processes' | 'app';

type MemoryGroupId = 'main' | 'renderer' | 'gpu' | 'utility' | 'widgets' | 'other';

interface PerformanceSectionChoice {
  id: PerformanceSectionId;
  label: string;
}

interface PerformanceRow {
  label: string;
  value: string;
}

interface PerformanceGroup {
  id: PerformanceSectionId;
  title: string;
  rows: readonly PerformanceRow[];
}

interface RendererSample {
  fps: number;
  frameMs: number;
  worstFrameMs: number;
  longTasks: number;
  longTaskMs: number;
  lagMs: number;
  domNodes: number;
  heapUsedBytes: number | null;
  heapLimitBytes: number | null;
}

interface ProcessSample {
  data: ProcessDiagnostics;
  ipcPerSecond: number | null;
}

interface RendererFeed {
  sample: RendererSample;
  fps: readonly number[];
  lag: readonly number[];
  longTasks: number;
  longTaskMs: number;
}

interface ProcessFeed {
  sample: ProcessSample;
  cpu: readonly number[];
  memory: readonly number[];
}

interface ProcessTotals {
  cpuPercent: number;
  memoryBytes: number;
}

interface SeriesChange {
  trend: StatTrend;
  text: string;
}

interface PerformanceTileSpec {
  id: string;
  label: string;
  value: string;
  unit?: string;
  tone?: StatusTone;
  change: SeriesChange;
  upIs: StatTrendMeaning;
  chart: SparklineProps;
}

interface GaugeReadings {
  cpu: number | null;
  memory: number | null;
  heap: number | null;
}

interface PerformanceBarProps {
  active: boolean;
  refreshMs: number;
  copied: boolean;
  onCopy: () => void;
}

interface ByteParts {
  value: string;
  unit: string;
}

interface MemoryGroup {
  id: MemoryGroupId;
  label: string;
  color: StackedBarColor;
}

interface AppFacts {
  version: string;
  screen: string | null;
  route: string | null;
  profile: string | null;
  openWidgets: readonly string[];
  modules: readonly string[];
  warnings: number;
  errors: number;
}

interface FrameCounter {
  frames: number;
  totalMs: number;
  worstMs: number;
  last: number | null;
}

interface TaskCounter {
  count: number;
  totalMs: number;
  lagMs: number;
}

interface HeapReading {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface RendererReading {
  frames: FrameCounter;
  tasks: TaskCounter;
  elapsedMs: number;
  heap: HeapReading | undefined;
  domNodes: number;
}

type PerformanceWithMemory = Performance & { memory?: HeapReading };

interface PerformanceSectionProps {
  group: PerformanceGroup;
}

interface PerformanceTilesProps {
  renderer: RendererFeed | null;
  processes: ProcessFeed | null;
  shown: readonly PerformanceSectionId[];
}

interface PerformanceGaugesProps {
  renderer: RendererSample | null;
  processes: ProcessSample | null;
  shown: readonly PerformanceSectionId[];
}

interface PerformanceMemoryProps {
  processes: ProcessSample | null;
}

interface PerformanceActivityProps {
  renderer: RendererFeed | null;
  facts: AppFacts;
  shown: readonly PerformanceSectionId[];
}

interface PerformanceDetailsProps {
  groups: readonly PerformanceGroup[];
}

export type {
  AppFacts, ByteParts, FrameCounter, GaugeReadings, MemoryGroup, MemoryGroupId, PerformanceActivityProps, PerformanceBarProps, PerformanceDetailsProps, PerformanceGaugesProps, PerformanceGroup, PerformanceMemoryProps,
  PerformanceRow, PerformanceSectionChoice, PerformanceSectionId, PerformanceSectionProps, PerformanceTileSpec, PerformanceTilesProps, PerformanceWithMemory, ProcessFeed, ProcessSample, ProcessTotals,
  RendererFeed, RendererReading, RendererSample, SeriesChange, TaskCounter,
};
