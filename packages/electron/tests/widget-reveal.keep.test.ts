/* @layer electron-main @kind test */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { bootEvents } from '../src/main/boot/boot-events';
import { bootState } from '../src/main/boot/boot-state';
import { REVEAL_MS } from '../src/main/boot/reveal.constants';
import { tryReveal } from '../src/main/boot/try-reveal';
import { openWidgetWindow } from '../src/main/widgets/open-widget-window';
import { widgetReveal } from '../src/main/widgets/widget-reveal';
import { widgetRuntime } from '../src/main/widgets/widget-runtime';
import { widgetWindowEntries } from '../src/main/widgets/widget-window-entries';
import { REVEAL_WAIT_MS } from '../src/main/widgets/widget-windows.constants';
import { shows, simOf } from './window-sim/fake-electron';
import type { FakeWindow } from './window-sim/fake-electron';
import { openMain } from './window-sim/scene';
import { box, simLifecycle } from './window-sim/sim-lifecycle';
import type { Rect } from './window-sim/window-sim.type';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);
vi.mock('../src/main/window/load-renderer', () => ({ loadRendererPage: (): void => undefined }));
vi.mock('../src/main/window/security', () => ({ applyWindowSecurity: (): void => undefined }));
vi.mock('../src/main/window/keep-in-background', () => ({ keepWindowInBackground: (): void => undefined }));

const platform = Object.getOwnPropertyDescriptor(process, 'platform');

const MAIN = box(700, 150, 800, 600);
const LOGS = box(400, 150, 300, 400);
const NOTES = box(1500, 150, 300, 300);

const sim = simLifecycle(2_400_000_000_000);

const setupFor = (headless: boolean) => ({ headless, muted: false, title: 'App', renderer: 'index.html', base: {} });

const bootMain = (headless = false): FakeWindow => {
  const main = openMain(MAIN);
  main.hide();
  Object.assign(bootState, {
    app: main, headless, splash: null, mainDone: false, rendererReady: false, failure: null, revealing: false, revealed: false, holds: [],
    present: () => (headless ? main.showInactive() : main.show()),
  });
  widgetRuntime.headless = headless;
  bootEvents.emit('window', main as never);
  return main;
};

const restore = (id: string, bounds: Rect, headless = false): FakeWindow => {
  openWidgetWindow(setupFor(headless), id, { bounds, sync: true });
  const entry = widgetWindowEntries.get(id);
  if (!entry) throw new Error(`${id} did not open`);
  return simOf(entry.win);
};

const finishBoot = async (): Promise<void> => {
  bootState.mainDone = true;
  bootState.rendererReady = true;
  tryReveal();
  await vi.advanceTimersByTimeAsync(0);
};

beforeAll(() => widgetReveal.watch());

beforeEach(() => {
  Object.defineProperty(process, 'platform', { value: 'win32' });
  return () => {
    if (platform) Object.defineProperty(process, 'platform', platform);
    widgetRuntime.headless = false;
  };
});

describe('restored widget windows at launch', () => {
  it('stay hidden until main is revealed, then show with main in the same tick and fade in with it', async () => {
    const main = bootMain();
    const logs = restore('logs', LOGS);
    const notes = restore('notes', NOTES);
    sim.track([main, logs, notes]);
    logs.emit('ready-to-show');
    notes.emit('ready-to-show');
    expect([main.isVisible(), logs.isVisible(), notes.isVisible()]).toEqual([false, false, false]);
    const atPresent: boolean[] = [];
    bootEvents.once('presenting', () => atPresent.push(main.isVisible(), logs.isVisible(), notes.isVisible()));
    await finishBoot();
    expect(atPresent).toEqual([true, true, true]);
    expect(shows).toEqual([
      { name: 'main', how: 'show', opacity: 0 },
      { name: 'App - logs', how: 'showInactive', opacity: 0 },
      { name: 'App - notes', how: 'showInactive', opacity: 0 },
    ]);
    await vi.advanceTimersByTimeAsync(REVEAL_MS / 2);
    expect(logs.opacity).toBeCloseTo(main.opacity, 1);
    expect(main.opacity).toBeGreaterThan(0);
    expect(main.opacity).toBeLessThan(1);
    await vi.advanceTimersByTimeAsync(REVEAL_MS);
    expect([main.opacity, logs.opacity, notes.opacity]).toEqual([1, 1, 1]);
    expect([logs.focusCalls, notes.focusCalls]).toEqual([0, 0]);
    expect(logs.getParentWindow()).toBe(main);
  });

  it('holds the reveal until a restored window is ready to show', async () => {
    const main = bootMain();
    const logs = restore('logs', LOGS);
    sim.track([main, logs]);
    await finishBoot();
    await vi.advanceTimersByTimeAsync(200);
    expect(main.isVisible()).toBe(false);
    logs.emit('ready-to-show');
    await vi.advanceTimersByTimeAsync(0);
    expect([main.isVisible(), logs.isVisible()]).toEqual([true, true]);
  });
});

describe('late and automation widget windows', () => {
  it('reveals main anyway when a restored window takes too long, and that window shows when it is ready', async () => {
    const main = bootMain();
    const logs = restore('logs', LOGS);
    sim.track([main, logs]);
    await finishBoot();
    await vi.advanceTimersByTimeAsync(REVEAL_WAIT_MS);
    expect([main.isVisible(), logs.isVisible()]).toEqual([true, false]);
    await vi.advanceTimersByTimeAsync(REVEAL_MS * 2);
    logs.emit('ready-to-show');
    expect(logs.isVisible()).toBe(true);
    expect(logs.opacity).toBe(1);
  });

  it('keeps an automation launch off screen and never focused', async () => {
    const main = bootMain(true);
    const logs = restore('logs', LOGS, true);
    sim.track([main, logs]);
    const placed = logs.getBounds();
    expect(placed.x).toBeGreaterThanOrEqual(1920);
    logs.emit('ready-to-show');
    await finishBoot();
    await vi.advanceTimersByTimeAsync(REVEAL_MS * 2);
    expect(shows.map((s) => s.how)).toEqual(['showInactive', 'showInactive']);
    expect(logs.getBounds()).toEqual(placed);
    expect([main.focusCalls, logs.focusCalls]).toEqual([0, 0]);
  });

  it('shows a window popped after the launch at once, as before', async () => {
    const main = bootMain();
    sim.track([main]);
    await finishBoot();
    await vi.advanceTimersByTimeAsync(REVEAL_MS * 2);
    const logs = restore('logs', LOGS);
    sim.track([main, logs]);
    logs.emit('ready-to-show');
    expect(logs.isVisible()).toBe(true);
    expect(logs.opacity).toBe(1);
  });
});
