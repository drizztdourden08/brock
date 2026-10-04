/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import type { FrameCounter, PerformanceWithMemory, RendererSample, TaskCounter } from '../PerformanceWidget.type';
import { countFrame } from './count-frame';
import { takeRendererSample } from './take-renderer-sample';
import { watchEventLoopLag } from './watch-event-loop-lag';
import { watchLongTasks } from './watch-long-tasks';

const useRendererSampler = (active: boolean, refreshMs: number): RendererSample | null => {
  const [sample, setSample] = useState<RendererSample | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    const frames: FrameCounter = { frames: 0, totalMs: 0, worstMs: 0, last: null };
    const tasks: TaskCounter = { count: 0, totalMs: 0, lagMs: 0 };
    let started = performance.now();
    let frame = 0;
    const step = (now: number): void => {
      countFrame(frames, now);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const stopTasks = watchLongTasks(tasks);
    const stopLag = watchEventLoopLag(tasks);
    const timer = setInterval(() => {
      const now = performance.now();
      const heap = (performance as PerformanceWithMemory).memory;
      setSample(takeRendererSample({ frames, tasks, elapsedMs: now - started, heap, domNodes: document.getElementsByTagName('*').length }));
      started = now;
    }, refreshMs);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      stopTasks();
      stopLag();
    };
  }, [active, refreshMs]);

  return sample;
};

export { useRendererSampler };
