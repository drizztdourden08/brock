/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { widgetWindowControl } from '../src/main/widgets/widget-window-control';
import { pinLevel } from '../src/main/window/pin-level';
import { setPinned } from '../src/main/window/set-pinned';
import { closeScene, openMain, openWidget } from './window-sim/scene';
import type { FakeWindow } from './window-sim/fake-electron';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

const MAIN = { x: 700, y: 150, width: 800, height: 600 };
const LOGS = { x: 400, y: 350, width: 300, height: 400 };
const platform = Object.getOwnPropertyDescriptor(process, 'platform');

let windows: FakeWindow[] = [];

const scene = (): { main: FakeWindow; logs: FakeWindow } => {
  const main = openMain(MAIN);
  const logs = openWidget('logs', LOGS, { sync: true });
  windows = [main, logs];
  return { main, logs };
};

beforeEach(() => {
  Object.defineProperty(process, 'platform', { value: 'win32' });
});

afterEach(() => {
  closeScene(windows);
  windows = [];
  if (platform) Object.defineProperty(process, 'platform', platform);
});

describe('pinLevel', () => {
  it('keeps a pinned window above the Windows taskbar band, and floating elsewhere', () => {
    expect(pinLevel('win32')).toBe('pop-up-menu');
    expect(pinLevel('darwin')).toBe('floating');
    expect(pinLevel('linux')).toBe('floating');
  });
});

describe('a pinned widget synced with the main window', () => {
  it('stays on top once pinned, through the main window focusing, minimizing and restoring', () => {
    const { main, logs } = scene();
    expect(widgetWindowControl.setPin('logs', 'top')).toBe('top');
    expect(logs.isAlwaysOnTop()).toBe(true);
    for (const event of ['focus', 'show', 'minimize', 'restore', 'focus']) main.emit(event);
    expect(logs.isAlwaysOnTop()).toBe(true);
    expect(logs.getParentWindow()).toBe(main);
  });

  it('follows the main pin while unpinned and keeps its own pin when the main one drops', () => {
    const { main, logs } = scene();
    setPinned(main as never, true);
    widgetWindowControl.mirrorMainPin(main.isAlwaysOnTop());
    expect(logs.isAlwaysOnTop()).toBe(true);
    widgetWindowControl.setPin('logs', 'top');
    setPinned(main as never, false);
    widgetWindowControl.mirrorMainPin(main.isAlwaysOnTop());
    expect(logs.isAlwaysOnTop()).toBe(true);
    widgetWindowControl.setPin('logs', 'off');
    expect(logs.isAlwaysOnTop()).toBe(false);
  });

  it('never asks Windows for a level that sits behind the taskbar', () => {
    const { logs } = scene();
    widgetWindowControl.setPin('logs', 'top');
    widgetWindowControl.setPin('logs', 'off');
    expect(logs.pinLevels.every((level) => level === 'pop-up-menu')).toBe(true);
  });
});
