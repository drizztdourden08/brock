/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { GaugeThresholds, StatusTone } from '@drizztdourden08/tessera/primitives';
import {
  CPU_FLOOR, CPU_THRESHOLDS, EMPTY_VALUE, HISTORY_LENGTH, LAG_BAND, LAG_FLOOR, LAG_THRESHOLDS, LOW_FPS, LOW_FPS_BAND, MEMORY_MARGIN, NO_SAMPLES, SPARK_MIN_LENGTH, STILL,
} from '../PerformanceWidget.constants';
import type { PerformanceSectionId, PerformanceTileSpec, ProcessFeed, RendererFeed } from '../PerformanceWidget.type';
import { byteParts } from './byte-parts';
import { levelTone } from './level-tone';
import { seriesChange } from './series-change';

const whole = (value: number): string => value.toFixed(0);

const tenths = (value: number): string => value.toFixed(1);

const reading = (value: number | undefined, format: (value: number) => string): string => (value === undefined ? EMPTY_VALUE : format(value));

const toneOf = (value: number | undefined, thresholds: GaugeThresholds): StatusTone | undefined => (value === undefined ? undefined : levelTone(value, thresholds));

const roomFor = (series: readonly number[]): number => Math.min(HISTORY_LENGTH, Math.max(series.length, SPARK_MIN_LENGTH));

const ceiling = (series: readonly number[], floor: number): number => Math.max(floor, ...series);

const memoryDomain = (series: readonly number[]): { min?: number; max?: number } => {
  if (series.length === 0) return {};
  const high = Math.max(...series);
  return { min: Math.max(0, Math.min(...series) - high * MEMORY_MARGIN), max: high + high * MEMORY_MARGIN };
};

const fpsTile = (series: readonly number[] = NO_SAMPLES): PerformanceTileSpec => {
  const now = series.at(-1);
  return {
    id: 'fps', label: 'Frame rate', value: reading(now, whole), unit: 'fps', tone: now !== undefined && now < LOW_FPS ? 'danger' : undefined,
    change: seriesChange(series, STILL.fps, whole), upIs: 'good',
    chart: { values: series, length: roomFor(series), min: 0, band: LOW_FPS_BAND, tone: 'success', dot: true, label: 'Frame rate', format: whole },
  };
};

const cpuTile = (series: readonly number[] = NO_SAMPLES): PerformanceTileSpec => {
  const now = series.at(-1);
  return {
    id: 'cpu', label: 'CPU', value: reading(now, tenths), unit: '%', tone: toneOf(now, CPU_THRESHOLDS),
    change: seriesChange(series, STILL.cpu, tenths), upIs: 'bad',
    chart: { values: series, length: roomFor(series), min: 0, max: ceiling(series, CPU_FLOOR), variant: 'area', tone: 'blue', label: 'CPU', format: tenths },
  };
};

const memoryTile = (series: readonly number[] = NO_SAMPLES): PerformanceTileSpec => {
  const now = series.at(-1);
  const parts = now === undefined ? { value: EMPTY_VALUE, unit: undefined } : byteParts(now);
  return {
    id: 'memory', label: 'Memory', value: parts.value, unit: parts.unit,
    change: seriesChange(series, STILL.memoryBytes, formatBytes), upIs: 'bad',
    chart: { values: series, length: roomFor(series), ...memoryDomain(series), variant: 'area', tone: 'violet', label: 'Memory', format: formatBytes },
  };
};

const lagTile = (series: readonly number[] = NO_SAMPLES): PerformanceTileSpec => {
  const now = series.at(-1);
  return {
    id: 'lag', label: 'Event loop lag', value: reading(now, tenths), unit: 'ms', tone: toneOf(now, LAG_THRESHOLDS),
    change: seriesChange(series, STILL.lag, tenths), upIs: 'bad',
    chart: { values: series, length: roomFor(series), min: 0, max: ceiling(series, LAG_FLOOR), band: LAG_BAND, tone: 'amber', dot: true, label: 'Event loop lag', format: tenths },
  };
};

const tileSpecs = (renderer: RendererFeed | null, processes: ProcessFeed | null, shown: readonly PerformanceSectionId[]): PerformanceTileSpec[] => {
  const showRenderer = shown.includes('renderer');
  const showProcesses = shown.includes('processes') && processes !== null;
  return [
    showRenderer && fpsTile(renderer?.fps),
    showProcesses && cpuTile(processes.cpu),
    showProcesses && memoryTile(processes.memory),
    showRenderer && lagTile(renderer?.lag),
  ].filter((tile): tile is PerformanceTileSpec => tile !== false);
};

export { tileSpecs };
