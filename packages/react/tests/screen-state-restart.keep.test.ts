/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/navigation/nav';
import '../src/screens/screen-persistence';
import '../src/widgets/widget-persistence';

interface Disk {
  file: Record<string, unknown>;
}

const fakeDisk = (initial: Record<string, unknown>) => {
  const disk: Disk = { file: structuredClone(initial) };
  const listeners = new Map<string, () => void>();
  const load = (): Promise<Record<string, unknown>> => Promise.resolve(structuredClone(disk.file));
  const save = (data: Record<string, unknown>): Promise<void> => {
    disk.file = structuredClone(data);
    return Promise.resolve();
  };
  const on = (name: string, fn: () => void): void => { listeners.set(name, fn); };
  const off = (name: string): void => { listeners.delete(name); };
  vi.stubGlobal('window', { location: { search: '' }, addEventListener: on, removeEventListener: off, api: { loadUiViews: load, saveUiViews: save } });
  return { disk, listeners };
};

const settle = async (): Promise<void> => {
  await vi.advanceTimersByTimeAsync(0);
};

const RESTORE = { navigation: true, homeScreen: 'game', known: (id: string) => ['game', 'data'].includes(id) };

const startApp = async () => {
  vi.resetModules();
  const { screenPersistence } = await import('../src/screens/screen-persistence');
  const { widgetPersistence } = await import('../src/widgets/widget-persistence');
  const { useScreenStateStore } = await import('../src/stores/useScreenStateStore');
  const { useWidgetPrefStore } = await import('../src/stores/useWidgetPrefStore');
  const { useNavigationStore } = await import('../src/navigation/useNavigationStore');
  const { nav } = await import('../src/navigation/nav');
  const stops = [screenPersistence.watch(), widgetPersistence.watch()];
  return {
    screenPersistence, widgetPersistence, nav,
    screens: () => useScreenStateStore.getState(),
    prefs: () => useWidgetPrefStore.getState(),
    navigation: () => useNavigationStore.getState(),
    stop: () => { for (const stop of stops) stop(); },
  };
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('screen state across a restart', { timeout: 60_000 }, () => {
  it('keeps a widget write and a screen write of one profile, and brings back the open hub, page, history and screen state', async () => {
    const { disk, listeners } = fakeDisk({ 'profile:p1': { widgetPrefs: { log: { filter: 'warn' } }, screens: { state: { about: 'broken', 'data/library': { sort: 'name' } } } } });
    const first = await startApp();
    await first.widgetPersistence.load('p1');
    await first.screenPersistence.load('p1', RESTORE);
    expect(first.screens().byScope).toEqual({ 'data/library': { sort: 'name' } });
    first.nav.open('game/saves');
    first.nav.open('game/tracker');
    first.screens().put('game/saves', 'filter', 'weekly');
    await settle();
    expect((disk.file['profile:p1'] as Record<string, unknown>).screens).toEqual({ state: { about: 'broken', 'data/library': { sort: 'name' } } });
    first.prefs().setPref('log', 'filter', 'error');
    listeners.get('pagehide')?.();
    first.stop();
    const stored = disk.file['profile:p1'] as Record<string, Record<string, unknown>>;
    expect(stored.widgetPrefs).toEqual({ log: { filter: 'error' } });
    expect(stored.screens?.state).toEqual({ 'data/library': { sort: 'name' }, 'game/saves': { filter: 'weekly' } });

    const second = await startApp();
    await second.screenPersistence.load('p1', RESTORE);
    expect(second.navigation()).toMatchObject({ active: 'game', params: { section: 'tracker' } });
    expect(second.nav.back()).toBe(true);
    expect(second.navigation().params.section).toBe('saves');
    expect(second.screens().byScope['game/saves']).toEqual({ filter: 'weekly' });
    second.stop();
  });

  it('leaves the navigation alone on an automation launch', async () => {
    fakeDisk({ 'profile:p1': { screens: { nav: { active: 'data', params: {}, history: {}, remembered: {} } } } });
    const app = await startApp();
    await app.screenPersistence.load('p1', { ...RESTORE, navigation: false });
    expect(app.navigation().active).toBeNull();
    app.stop();
  });
});
