/* @layer renderer-shell @kind logic */
import { MS_PER_SECOND } from '../PerformanceWidget.constants';
import type { RendererReading, RendererSample } from '../PerformanceWidget.type';

const takeRendererSample = (reading: RendererReading): RendererSample => {
  const { frames, tasks, elapsedMs, heap, domNodes } = reading;
  const sample: RendererSample = {
    fps: elapsedMs > 0 ? (frames.frames * MS_PER_SECOND) / elapsedMs : 0,
    frameMs: frames.frames > 0 ? frames.totalMs / frames.frames : 0,
    worstFrameMs: frames.worstMs,
    longTasks: tasks.count,
    longTaskMs: tasks.totalMs,
    lagMs: tasks.lagMs,
    domNodes,
    heapUsedBytes: heap?.usedJSHeapSize ?? null,
    heapLimitBytes: heap?.jsHeapSizeLimit ?? null,
  };
  frames.frames = 0;
  frames.totalMs = 0;
  frames.worstMs = 0;
  tasks.count = 0;
  tasks.totalMs = 0;
  tasks.lagMs = 0;
  return sample;
};

export { takeRendererSample };
