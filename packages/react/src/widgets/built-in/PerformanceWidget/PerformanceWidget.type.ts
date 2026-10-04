/* @layer renderer-shell @kind types */
import type { ProcessDiagnostics } from '@drizztdourden08/brock-core';

type PerformanceSectionId = 'renderer' | 'processes' | 'app';

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

export type {
  AppFacts, FrameCounter, PerformanceGroup, PerformanceRow, PerformanceSectionChoice, PerformanceSectionId, PerformanceSectionProps, PerformanceWithMemory, ProcessSample,
  RendererReading, RendererSample, TaskCounter,
};
