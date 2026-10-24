/* @layer electron-main @kind test */
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readAppLaunch } from '../src/bridge';
import type { MainContext } from '../src/main/types/main-context.type';
import { appLaunch } from '../src/main/bridge/app-launch';
import { bridgeLaunchFile } from '../src/main/bridge/bridge-launch-file';
import { createAppBridge } from '../src/main/bridge/create-app-bridge';
import { writePrivateFile } from '../src/main/bridge/write-private-file';
import { closeOpened, tempDir, writeOpenFile } from './bridge-fixture';

const APP_PATH = '/app/dist/electron';
const fakeApp = vi.hoisted(() => ({ isPackaged: false, getAppPath: (): string => '/app/dist/electron', once: (): void => undefined }));
vi.mock('electron', () => {
  return { app: fakeApp };
});

const realArgv = process.argv;

beforeEach(() => {
  fakeApp.isPackaged = false;
  process.argv = ['electron', APP_PATH];
});

afterEach(() => {
  process.argv = realArgv;
  closeOpened();
});

const openedBridge = async (log = vi.fn()) => {
  const file = join(tempDir(), 'bxel', 'bridge.json');
  const ctx: MainContext = { product: { id: 'bxel' }, log } as never;
  const bridge = createAppBridge({ options: { register: () => undefined }, file: () => file, ctx: () => ctx });
  await bridge.open();
  return { bridge, file, log };
};

describe('appLaunch', () => {
  it('starts the stock Electron on the app folder in development and the executable alone when packaged', () => {
    expect(appLaunch()).toEqual({ command: process.execPath, args: [APP_PATH], env: {} });
    fakeApp.isPackaged = true;
    expect(appLaunch()).toEqual({ command: process.execPath, args: [], env: {} });
  });

  it('adds --background only when asked, and keeps the identity of this launch', () => {
    process.argv = ['electron', '.', '--instance=work', '--profile=a', '--user-data=data/x', '--no-focus', '--background', '--screenshot=boot'];
    expect(appLaunch().args).toEqual([APP_PATH, '--instance=work', '--profile=a', `--user-data=${resolve('data/x')}`]);
    expect(appLaunch({ background: true }).args.at(-1)).toBe('--background');
  });
});

describe('the app launch file', () => {
  it('sits beside the discovery file under its own name, so no instance key can collide with it', () => {
    expect(bridgeLaunchFile(join('a', 'bridge.json'))).toBe(join('a', 'launch-bridge.json'));
    expect(bridgeLaunchFile(join('a', 'bridge.launch.json'))).toBe(join('a', 'launch-bridge.launch.json'));
  });

  it('is written when the bridge opens, and stays after it closes so a helper can start an app that is not running', async () => {
    const { bridge, file } = await openedBridge();
    const launch = bridgeLaunchFile(file);
    expect(JSON.parse(readFileSync(launch, 'utf8'))).toEqual({ command: process.execPath, args: [APP_PATH], env: {} });
    bridge.close();
    expect(existsSync(file)).toBe(false);
    expect(readAppLaunch({ file })).toEqual({ command: process.execPath, args: [APP_PATH], env: {} });
  });

  it('lets the helper ask for --background once', async () => {
    const { bridge, file } = await openedBridge();
    expect(readAppLaunch({ file, background: true }).args).toEqual([APP_PATH, '--background']);
    writePrivateFile(bridgeLaunchFile(file), JSON.stringify({ command: process.execPath, args: ['--background'], env: {} }));
    expect(readAppLaunch({ file, background: true }).args).toEqual(['--background']);
    bridge.close();
  });

  it('refuses a missing file, an open file and a descriptor that is not a plain absolute command', () => {
    const file = join(tempDir(), 'bridge.json');
    expect(() => readAppLaunch({ file })).toThrow('is missing');
    writeOpenFile(bridgeLaunchFile(file), JSON.stringify({ command: process.execPath, args: [], env: {} }));
    expect(() => readAppLaunch({ file })).toThrow('the bridge refuses it');
    const bad = [{ command: 'electron', args: [], env: {} }, { command: process.execPath, args: [1], env: {} }, { command: process.execPath, args: [], env: { A: 1 } }, 'text'];
    for (const descriptor of bad) {
      writePrivateFile(bridgeLaunchFile(file), JSON.stringify(descriptor));
      expect(() => readAppLaunch({ file })).toThrow('is not an app launch file');
    }
  });

  it('keeps the bridge open and logs a warning when the launch file cannot be written', async () => {
    const log = vi.fn();
    const file = join(tempDir(), 'bridge.json');
    const ctx: MainContext = { product: { id: 'bxel' }, log } as never;
    const bridge = createAppBridge({ options: { register: () => undefined }, file: () => file, ctx: () => ctx });
    fakeApp.getAppPath = () => {
      throw new Error('no app path');
    };
    await expect(bridge.open()).resolves.toBeDefined();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('the app launch file was not written: no app path'), 'warn');
    fakeApp.getAppPath = () => APP_PATH;
    bridge.close();
  });
});
