/* @layer renderer-shell @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core';
import type { PerformanceRow, RendererSample } from '../PerformanceWidget.type';

const ms = (value: number): string => `${value.toFixed(1)} ms`;

const heapText = (sample: RendererSample): string => {
  if (sample.heapUsedBytes === null) return 'not reported';
  const limit = sample.heapLimitBytes === null ? '' : ` of ${formatBytes(sample.heapLimitBytes)}`;
  return `${formatBytes(sample.heapUsedBytes)}${limit}`;
};

const rendererRows = (sample: RendererSample | null): PerformanceRow[] => {
  if (!sample) return [{ label: 'Frame rate', value: 'sampling' }];
  return [
    { label: 'Frame rate', value: `${sample.fps.toFixed(0)} fps` },
    { label: 'Frame time', value: `${ms(sample.frameMs)} avg, ${ms(sample.worstFrameMs)} worst` },
    { label: 'Long tasks', value: sample.longTasks > 0 ? `${sample.longTasks} (${ms(sample.longTaskMs)})` : 'none' },
    { label: 'Event loop lag', value: ms(sample.lagMs) },
    { label: 'JS heap', value: heapText(sample) },
    { label: 'DOM nodes', value: String(sample.domNodes) },
  ];
};

export { rendererRows };
