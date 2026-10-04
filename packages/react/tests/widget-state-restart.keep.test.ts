/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setPopped } from '@drizztdourden08/tessera/composites';

const LOG_BOUNDS = { x: 40, y: 60, width: 420, height: 300 };
const FLOAT_RECT = { x: 10, y: 20, width: 300, height: 200 };

const fakeDisk = (initial: Record<string, unknown>) => {
  const disk = { file: structuredClone(initial), saves: 0 };
  const listeners = new Map<string, () => void>();
  const api = {
    loadUiViews: () => Promise.resolve(structuredClone(disk.file)),
    saveUiViews: (data: Record<string, unknown>) => {
      disk.file = structuredClone(data);
      disk.saves += 1;
      return Promise.resolve();
    },
  };
  vi.stubGlobal('window', {
    api,
    location: { search: '' },
    addEventListener: (name: string, fn: () => void) => listeners.set(name, fn),
    removeEventListener: (name: string) => listeners.delete(name),
  });
  return { disk, listeners };
};

const settle = async (): Promise<void> => {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
};

const startApp = async () => {
  vi.resetModules();
  const { widgetPersistence } = await import('../src/widgets/widget-persistence');
  const { useWidgetLayoutStore } = await import('../src/widgets/useWidgetLayoutStore');
  const { useWidgetPrefStore } = await import('../src/stores/useWidgetPrefStore');
  const { defineWidget } = await import('../src/widgets/define-widget');
  const definitions = [
    defineWidget({ id: 'log', label: 'Log', render: () => null, popOut: true }),
    defineWidget({ id: 'hints', label: 'Hints', render: () => null }),
    defineWidget({ id: 'room', label: 'Room', render: () => null }),
  ];
  useWidgetLayoutStore.getState().setDefinitions(definitions);
  const stop = widgetPersistence.watch();
  return { widgetPersistence, layout: () => useWidgetLayoutStore.getState(), prefs: () => useWidgetPrefStore.getState(), stop };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('widget state across a restart', { timeout: 60_000 }, () => {
  it('writes the dock, the floating and popped bounds and every widget pref, and reads them back after a restart', async () => {
    const { disk, listeners } = fakeDisk({ 'profile:p1': { screens: { home: { tab: 'news' } } } });
    const first = await startApp();
    await first.widgetPersistence.load('p1');
    first.layout().open('room');
    first.layout().change((layout) => ({ ...layout, floating: [{ id: 'hints', ...FLOAT_RECT }] }));
    first.layout().popOut('log');
    first.layout().change((layout) => setPopped(layout, 'log', { bounds: LOG_BOUNDS }));
    first.prefs().setPref('log', 'filter', 'error');
    first.prefs().setPref('room', 'tab', 'players');
    await settle();
    expect([...listeners.keys()].sort()).toEqual(['beforeunload', 'pagehide']);
    listeners.get('pagehide')?.();
    first.stop();
    const saved = first.layout().layout;

    const second = await startApp();
    expect(second.prefs().hydrated).toBe(false);
    await second.widgetPersistence.load('p1');
    expect(second.layout().layout).toEqual(saved);
    expect(second.layout().layout.popped).toMatchObject([{ id: 'log', bounds: LOG_BOUNDS }]);
    expect(second.layout().layout.floating).toEqual([{ id: 'hints', ...FLOAT_RECT }]);
    expect(second.prefs().byWidget).toEqual({ log: { filter: 'error' }, room: { tab: 'players' } });
    expect(second.prefs().hydrated).toBe(true);
    expect((disk.file['profile:p1'] as Record<string, unknown>).screens).toEqual({ home: { tab: 'news' } });
    second.stop();
  });
});

describe('widget state per profile', { timeout: 60_000 }, () => {
  it('gives each profile its own widgets and brings them back after a switch', async () => {
    fakeDisk({});
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    app.layout().open('room');
    app.prefs().setPref('room', 'tab', 'hints');
    await settle();

    await app.widgetPersistence.load('p2');
    app.prefs().hydrate({});
    expect(app.layout().layout.dock).toEqual({ kind: 'main', key: 'main' });
    app.prefs().setPref('room', 'tab', 'log');
    await settle();

    await app.widgetPersistence.load('p1');
    expect(app.layout().layout.dock).not.toEqual({ kind: 'main', key: 'main' });
    expect(app.prefs().byWidget).toEqual({ room: { tab: 'hints' } });
    app.stop();

    const restarted = await startApp();
    await restarted.widgetPersistence.load('p2');
    expect(restarted.prefs().byWidget).toEqual({ room: { tab: 'log' } });
    restarted.stop();
  });

  it('drops a malformed widget entry instead of handing it to the widget', async () => {
    fakeDisk({ 'profile:p1': { widgetPrefs: { log: { filter: 'warn' }, room: 'broken', hints: null } } });
    const app = await startApp();
    await app.widgetPersistence.load('p1');
    expect(app.prefs().byWidget).toEqual({ log: { filter: 'warn' } });
    app.stop();
  });

  it('keeps a widget own state under the widget it is drawn in', async () => {
    fakeDisk({});
    const app = await startApp();
    const { WidgetBody } = await import('../src/widgets/WidgetBody');
    const { useWidgetState } = await import('../src/hooks/useWidgetState');
    await app.widgetPersistence.load('p1');
    const setters: ((next: number | ((prev: number) => number)) => void)[] = [];
    const Counter = () => {
      const [count, setCount] = useWidgetState('count', 3);
      setters.push(setCount);
      return `count ${count}`;
    };
    expect(renderToStaticMarkup(createElement(WidgetBody, { id: 'room', label: 'Room' }, createElement(Counter)))).toBe('count 3');
    setters[0]?.(5);
    setters[0]?.((prev) => prev + 1);
    expect(app.prefs().byWidget).toEqual({ room: { count: 6 } });
    app.stop();
  });
});
