/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ProcessDiagnostics } from '@drizztdourden08/brock-core';
import { performanceChecks } from '../src/review/checks/performance-checks';
import type { PerformanceReading } from '../src/review/review.type';
import { BUILT_IN_WIDGETS } from '../src/widgets/built-in-widgets.constants';
import { buildSnapshot } from '../src/widgets/built-in/PerformanceWidget/behavior/build-snapshot';
import { byteParts } from '../src/widgets/built-in/PerformanceWidget/behavior/byte-parts';
import { countFrame } from '../src/widgets/built-in/PerformanceWidget/behavior/count-frame';
import { memorySegments } from '../src/widgets/built-in/PerformanceWidget/behavior/memory-segments';
import { memoryShare } from '../src/widgets/built-in/PerformanceWidget/behavior/memory-share';
import { performanceGroups } from '../src/widgets/built-in/PerformanceWidget/behavior/performance-groups';
import { processTotals } from '../src/widgets/built-in/PerformanceWidget/behavior/process-totals';
import { pushSeries } from '../src/widgets/built-in/PerformanceWidget/behavior/push-series';
import { seriesChange } from '../src/widgets/built-in/PerformanceWidget/behavior/series-change';
import { takeRendererSample } from '../src/widgets/built-in/PerformanceWidget/behavior/take-renderer-sample';
import { HISTORY_LENGTH } from '../src/widgets/built-in/PerformanceWidget/PerformanceWidget.constants';
import type { AppFacts, FrameCounter, TaskCounter } from '../src/widgets/built-in/PerformanceWidget/PerformanceWidget.type';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

const MIB = 1024 ** 2;

const FACTS: AppFacts = {
  version: '1.2.3', screen: 'game', route: 'bucket=game page=saves', profile: 'Ada', openWidgets: ['logs'], modules: ['updater'], warnings: 2, errors: 1,
};

const PROCESSES: ProcessDiagnostics = {
  processes: [
    { pid: 10, type: 'Browser', name: null, cpuPercent: 1.5, workingSetBytes: 100 * MIB, privateBytes: null, window: null },
    { pid: 11, type: 'Tab', name: 'renderer', cpuPercent: 2.5, workingSetBytes: 50 * MIB, privateBytes: 40 * MIB, window: 'main' },
    { pid: 12, type: 'Tab', name: null, cpuPercent: 0.5, workingSetBytes: 30 * MIB, privateBytes: null, window: 'logs' },
    { pid: 13, type: 'GPU', name: null, cpuPercent: 0.2, workingSetBytes: 70 * MIB, privateBytes: null, window: null },
    { pid: 14, type: 'Utility', name: 'Network Service', cpuPercent: 0, workingSetBytes: 20 * MIB, privateBytes: null, window: null },
  ],
  main: { rssBytes: 80 * MIB, heapUsedBytes: 10 * MIB, heapTotalBytes: 20 * MIB, externalBytes: MIB },
  uptimeSeconds: 3700,
  windowCount: 2,
  widgetWindows: [{ id: 'logs', visible: true, sync: true, cluster: 2 }],
  ipcCalls: 40,
  versions: { node: '22', v8: '13', chrome: '140', electron: '38' },
  gpuFeatures: { gpu_compositing: 'enabled' },
  memoryTotalBytes: 8000 * MIB,
};

const rowsOf = (title: string, groups: ReturnType<typeof performanceGroups>) =>
  Object.fromEntries(groups.find((group) => group.title === title)?.rows.map((row) => [row.label, row.value]) ?? []);

describe('widgetsFromFiles', () => {
  it('names a widget from its file id and keeps the meta', () => {
    const Panel = () => null;
    const [def] = widgetsFromFiles([{ id: 'live-room', component: Panel, meta: { icon: 'house', popOut: true, defaultVisibility: 'context-only' } }]);
    expect(def).toMatchObject({ id: 'live-room', label: 'Live Room', icon: 'house', popOut: true, defaultVisibility: 'context-only', defaultSide: 'right' });
    expect(def?.settings).toBeUndefined();
  });

  it('lists Logs and Performance as the built-in widgets, with a settings panel on Performance', () => {
    expect(BUILT_IN_WIDGETS.map((def) => [def.id, def.label, def.popOut, def.devOnly ?? false])).toEqual([['logs', 'Logs', true, false], ['performance', 'Performance', true, false]]);
    expect(BUILT_IN_WIDGETS[1]?.settings).toBeTypeOf('function');
  });
});

describe('the renderer sample', () => {
  it('turns counted frames and tasks into rates, then resets the counters', () => {
    const frames: FrameCounter = { frames: 0, totalMs: 0, worstMs: 0, last: null };
    for (const now of [0, 16, 32, 80, 96]) countFrame(frames, now);
    const tasks: TaskCounter = { count: 2, totalMs: 130, lagMs: 12 };
    const sample = takeRendererSample({ frames, tasks, elapsedMs: 1000, heap: { usedJSHeapSize: 5 * MIB, jsHeapSizeLimit: 100 * MIB }, domNodes: 420 });
    expect(sample).toEqual({ fps: 4, frameMs: 24, worstFrameMs: 48, longTasks: 2, longTaskMs: 130, lagMs: 12, domNodes: 420, heapUsedBytes: 5 * MIB, heapLimitBytes: 100 * MIB });
    expect(frames).toMatchObject({ frames: 0, totalMs: 0, worstMs: 0, last: 96 });
    expect(tasks).toEqual({ count: 0, totalMs: 0, lagMs: 0 });
  });
});

describe('performanceGroups and the snapshot', () => {
  const renderer = { fps: 60, frameMs: 16.7, worstFrameMs: 33.4, longTasks: 0, longTaskMs: 0, lagMs: 1.2, domNodes: 900, heapUsedBytes: null, heapLimitBytes: null };

  it('shows only the sections the pref keeps, in a fixed order', () => {
    expect(performanceGroups(['app', 'renderer'], renderer, null, FACTS).map((group) => group.id)).toEqual(['renderer', 'app']);
  });

  it('reads the main process, every process and the widget windows', () => {
    const rows = rowsOf('Processes', performanceGroups(['processes'], null, { data: PROCESSES, ipcPerSecond: 3.25 }, FACTS));
    expect(rows['All processes']).toBe('5, 4.7% CPU, 270.0 MB');
    expect(rows['System memory']).toBe('7.8 GB, the app holds 3.4%');
    expect(rows['IPC calls']).toBe('3.3/s, 40 total');
    expect(rows['Uptime']).toBe('1h 1m');
    expect(rows['renderer 11 (main window)']).toBe('2.5% CPU, 50.0 MB');
    expect(rows['Tab 12 (logs window)']).toBe('0.5% CPU, 30.0 MB');
    expect(rows['Widget window logs']).toBe('shown, synced, snapped with 1 more');
  });

  it('copies every shown row under a dated title', () => {
    const groups = performanceGroups(['renderer', 'app'], renderer, null, FACTS);
    const text = buildSnapshot(groups, new Date('2026-10-04T10:00:00Z'));
    expect(text.split('\n').slice(0, 4)).toEqual(['Performance snapshot, 2026-10-04T10:00:00.000Z', '', 'Renderer', '  Frame rate: 60 fps']);
    expect(text).toContain('  JS heap: not reported');
    expect(text).toContain('  Log since start: 1 errors, 2 warnings');
  });
});

describe('the visual parts', () => {
  it('keeps the last samples of each series, oldest first', () => {
    const long = Array.from({ length: HISTORY_LENGTH }, (_, index) => index);
    expect(pushSeries(undefined, 5)).toEqual([5]);
    const next = pushSeries(long, 99);
    expect(next).toHaveLength(HISTORY_LENGTH);
    expect(next.at(0)).toBe(1);
    expect(next.at(-1)).toBe(99);
  });

  it('reads the trend and the delta of the latest sample', () => {
    const tenths = (value: number): string => value.toFixed(1);
    expect(seriesChange([10, 12.5], 0.1, tenths)).toEqual({ trend: 'up', text: '+2.5' });
    expect(seriesChange([10, 7], 0.1, tenths)).toEqual({ trend: 'down', text: '-3.0' });
    expect(seriesChange([10, 10.05], 0.1, tenths)).toEqual({ trend: 'flat', text: '0.0' });
    expect(seriesChange([], 0.1, tenths)).toEqual({ trend: 'flat', text: '0.0' });
  });

  it('splits memory into main, renderer, GPU, utility and widget windows', () => {
    expect(memorySegments(PROCESSES.processes).map((part) => [part.label, part.value / MIB])).toEqual([
      ['Main', 100], ['Renderer', 50], ['GPU', 70], ['Utility', 20], ['Widget windows', 30],
    ]);
  });

  it('sums the processes and reads the share of system memory', () => {
    const totals = processTotals(PROCESSES);
    expect(totals.cpuPercent).toBeCloseTo(4.7);
    expect(totals.memoryBytes).toBe(270 * MIB);
    expect(memoryShare(totals.memoryBytes, PROCESSES.memoryTotalBytes)).toBeCloseTo(3.375);
    expect(memoryShare(10, null)).toBeNull();
    expect(byteParts(270 * MIB)).toEqual({ value: '270.0', unit: 'MB' });
  });
});

describe('performanceChecks', () => {
  const reading: PerformanceReading = {
    tiles: { 'Frame rate': '59', CPU: '3.0', Memory: '400.0', 'Event loop lag': '1.2' },
    sparklines: ['M0 1L1 2', 'M0 1L1 3', 'M0 2L1 2', 'M0 0L1 1'],
    gauges: ['CPU', 'Memory', 'JS heap'],
    segments: 4,
    legend: ['Main', 'Renderer', 'GPU', 'Utility'],
    ownScroll: false,
  };

  it('passes when the tiles, sparklines, gauges and memory bar render and move', () => {
    const before = { ...reading, tiles: { ...reading.tiles, CPU: '2.0' }, sparklines: ['M0 0', ...reading.sparklines.slice(1)] };
    const outcomes = performanceChecks({ before, after: reading, sampling: true, inBody: true });
    expect(outcomes.filter((outcome) => !outcome.pass)).toEqual([]);
  });

  it('fails a frozen, empty or self-scrolling widget', () => {
    const empty: PerformanceReading = { tiles: { 'Frame rate': '-' }, sparklines: [''], gauges: [], segments: 0, legend: [], ownScroll: true };
    const outcomes = performanceChecks({ before: empty, after: empty, sampling: false, inBody: true });
    expect(outcomes.filter((outcome) => !outcome.pass).map((outcome) => outcome.id)).toEqual([
      'performance-sampling', 'performance-tiles', 'performance-frame-rate', 'performance-sparklines', 'performance-gauges', 'performance-memory-bar', 'performance-live', 'performance-body-scrolls',
    ]);
  });
});
