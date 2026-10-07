/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FileStore } from '@drizztdourden08/brock-core';
import '../src/profiles/profile-store';
import '../src/profiles/update-app-state';
import '../src/tours/tour-persistence';
import '../src/tours/tours';
import { SESSIONS, WELCOME } from './tour-fixtures';

const platform = vi.hoisted(() => ({ files: null as FileStore | null }));

vi.mock('../src/platform/get-platform', () => ({ getPlatform: () => ({ files: platform.files }) }));

interface Disk {
  files: Map<string, string>;
  views: Record<string, unknown>;
}

const memoryFiles = (files: Map<string, string>): FileStore => {
  const nothing = (): Promise<null> => Promise.resolve(null);
  const done = (): Promise<void> => Promise.resolve();
  const folders = (dir: string): string[] => [...new Set([...files.keys()].filter((path) => path.startsWith(`${dir}/`)).map((path) => path.split('/')[1] ?? ''))];
  return {
    readBytes: nothing,
    stat: nothing,
    writeBytes: done,
    mkdir: done,
    remove: done,
    readText: (path) => Promise.resolve(files.get(path) ?? null),
    writeText: (path, data) => Promise.resolve(void files.set(path, data)),
    list: (dir) => Promise.resolve(folders(dir)),
    exists: (path) => Promise.resolve(files.has(path)),
  };
};

const newDisk = (views: Record<string, unknown> = {}, files: Record<string, unknown> = {}): Disk =>
  ({ views, files: new Map(Object.entries(files).map(([path, data]) => [path, JSON.stringify(data)])) });

const appJson = (disk: Disk): Record<string, unknown> => JSON.parse(disk.files.get('app.json') ?? '{}') as Record<string, unknown>;

const boot = async (disk: Disk) => {
  vi.resetModules();
  platform.files = memoryFiles(disk.files);
  vi.stubGlobal('window', {
    location: { search: '' },
    api: {
      startup: { automation: false },
      loadUiViews: () => Promise.resolve(structuredClone(disk.views)),
      saveUiViews: (data: Record<string, unknown>) => { disk.views = structuredClone(data); return Promise.resolve(); },
    },
  });
  const { tours } = await import('../src/tours/tours');
  const { tourPersistence } = await import('../src/tours/tour-persistence');
  const { useTourStore } = await import('../src/tours/useTourStore');
  const { profileStore } = await import('../src/profiles/profile-store');
  const { updateAppState } = await import('../src/profiles/update-app-state');
  useTourStore.getState().setTours([SESSIONS, WELCOME]);
  await tourPersistence.load();
  const stop = tourPersistence.watch();
  const createProfile = (name: string) => profileStore().create({ name });
  const flush = (): Promise<unknown> => updateAppState((state) => state);
  return { tours, stop, createProfile, flush, store: () => useTourStore.getState() };
};

afterEach(() => {
  platform.files = null;
  vi.unstubAllGlobals();
});

describe('first run is app-wide', () => {
  it('runs the first-run tour once on a fresh install, and never again for a second profile or after a restart', async () => {
    const disk = newDisk();
    const first = await boot(disk);
    expect(first.store().firstUse).toBe(true);
    expect(appJson(disk).firstRun).toBe('pending');
    await first.createProfile('One');
    expect(first.tours.startFirstRun()).toBe(true);
    expect(first.store().active?.id).toBe('welcome');
    first.tours.stop();
    await first.createProfile('Two');
    expect(first.tours.startFirstRun()).toBe(false);
    await first.flush();
    expect(appJson(disk)).toMatchObject({ firstRun: 'done', tours: { started: ['welcome'] } });
    first.stop();
    const again = await boot(disk);
    expect(again.store().firstUse).toBe(false);
    expect(again.tours.startFirstRun()).toBe(false);
    again.stop();
  });

  it('keeps the first use open across a restart until a profile is active and the tour has had its turn', async () => {
    const disk = newDisk();
    (await boot(disk)).stop();
    const second = await boot(disk);
    await second.createProfile('One');
    second.stop();
    const third = await boot(disk);
    expect(third.store().firstUse).toBe(true);
    expect(third.tours.startFirstRun()).toBe(true);
    third.stop();
  });

  it('never runs a first-run tour on an install upgraded with profiles or saved views', async () => {
    const withProfile = newDisk({}, { 'app.json': { lastProfileId: 'p1' }, 'profiles/p1/profile.json': { id: 'p1', name: 'One', created: 1, lastPlayed: 1 } });
    const upgraded = await boot(withProfile);
    expect(upgraded.store().firstUse).toBe(false);
    expect(upgraded.tours.startFirstRun()).toBe(false);
    expect(appJson(withProfile)).toMatchObject({ lastProfileId: 'p1', firstRun: 'done' });
    upgraded.stop();
    const withViews = newDisk({ 'profile:gone': { screens: {} } });
    const viewsOnly = await boot(withViews);
    expect(viewsOnly.store().firstUse).toBe(false);
    expect(appJson(withViews).firstRun).toBe('done');
    viewsOnly.stop();
  });

  it('merges every profile\'s tour progress into the app-wide record once and removes the profile keys', async () => {
    const disk = newDisk({
      'profile:p1': { tours: { completed: ['welcome'], started: ['welcome'], last: {} }, widgetLayout: { v: 2 } },
      'profile:p2': { tours: { completed: [], started: ['sessions'], last: { sessions: 1 } } },
    });
    const upgraded = await boot(disk);
    expect(upgraded.tours.isCompleted('welcome')).toBe(true);
    expect(upgraded.store().progress).toEqual({ completed: ['welcome'], started: ['welcome', 'sessions'], last: { sessions: 1 } });
    expect(appJson(disk)).toMatchObject({ firstRun: 'done', tours: { completed: ['welcome'], started: ['welcome', 'sessions'], last: { sessions: 1 } } });
    expect(disk.views).toEqual({ 'profile:p1': { widgetLayout: { v: 2 } }, 'profile:p2': {} });
    upgraded.stop();
    const again = await boot(disk);
    expect(again.store().progress).toEqual({ completed: ['welcome'], started: ['welcome', 'sessions'], last: { sessions: 1 } });
    again.stop();
  });
});
