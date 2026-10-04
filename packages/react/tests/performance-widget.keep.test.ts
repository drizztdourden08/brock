/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import type { ProcessDiagnostics } from '@drizztdourden08/brock-core';
import { performanceChecks } from '../src/review/checks/performance-checks';
import { BUILT_IN_WIDGETS } from '../src/widgets/built-in-widgets.constants';
import { buildSnapshot } from '../src/widgets/built-in/PerformanceWidget/behavior/build-snapshot';
import { countFrame } from '../src/widgets/built-in/PerformanceWidget/behavior/count-frame';
import { performanceGroups } from '../src/widgets/built-in/PerformanceWidget/behavior/performance-groups';
import { takeRendererSample } from '../src/widgets/built-in/PerformanceWidget/behavior/take-renderer-sample';
import type { AppFacts, FrameCounter, TaskCounter } from '../src/widgets/built-in/PerformanceWidget/PerformanceWidget.type';
import { widgetsFromFiles } from '../src/widgets/widgets-from-files';

const MIB = 1024 ** 2;

const FACTS: AppFacts = {
  version: '1.2.3', screen: 'game', route: 'bucket=game page=saves', profile: 'Ada', openWidgets: ['logs'], modules: ['updater'], warnings: 2, errors: 1,
};

const PROCESSES: ProcessDiagnostics = {
  processes: [
    { pid: 10, type: 'Browser', name: null, cpuPercent: 1.5, workingSetBytes: 100 * MIB, privateBytes: null },
    { pid: 11, type: 'Tab', name: 'renderer', cpuPercent: 2.5, workingSetBytes: 50 * MIB, privateBytes: 40 * MIB },
  ],
  main: { rssBytes: 80 * MIB, heapUsedBytes: 10 * MIB, heapTotalBytes: 20 * MIB, externalBytes: MIB },
  uptimeSeconds: 3700,
  windowCount: 2,
  widgetWindows: [{ id: 'logs', visible: true, sync: true, cluster: 2 }],
  ipcCalls: 40,
  versions: { node: '22', v8: '13', chrome: '140', electron: '38' },
  gpuFeatures: { gpu_compositing: 'enabled' },
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
    expect(rows['All processes']).toBe('2, 4.0% CPU, 150.0 MB');
    expect(rows['IPC calls']).toBe('3.3/s, 40 total');
    expect(rows['Uptime']).toBe('1h 1m');
    expect(rows['renderer 11']).toBe('2.5% CPU, 50.0 MB');
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

describe('performanceChecks', () => {
  const after = { 'Frame rate': '59 fps', 'All processes': '5, 3.0% CPU, 400.0 MB', 'DOM nodes': '901' };

  it('passes when the widget samples and its numbers move', () => {
    const outcomes = performanceChecks({ before: { ...after, 'DOM nodes': '900' }, after, sampling: true });
    expect(outcomes.filter((outcome) => !outcome.pass)).toEqual([]);
  });

  it('fails a frozen or empty widget', () => {
    const outcomes = performanceChecks({ before: { 'Frame rate': 'sampling' }, after: { 'Frame rate': 'sampling' }, sampling: false });
    expect(outcomes.filter((outcome) => !outcome.pass).map((outcome) => outcome.id)).toEqual(['performance-sampling', 'performance-frame-rate', 'performance-processes', 'performance-live']);
  });
});
