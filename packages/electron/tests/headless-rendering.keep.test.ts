/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from 'electron';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { pinHeadlessRendering } from '../src/main/window/pin-headless-rendering';

const switches = new Set<string>();

vi.mock('electron', () => ({
  app: {
    disableHardwareAcceleration: vi.fn(),
    commandLine: {
      hasSwitch: vi.fn((name: string) => switches.has(name)),
      appendSwitch: vi.fn((name: string) => { switches.add(name); }),
    },
  },
}));

const flags = createAutomationFlags();

beforeEach(() => {
  switches.clear();
  vi.mocked(app.disableHardwareAcceleration).mockClear();
  vi.mocked(app.commandLine.appendSwitch).mockClear();
});

describe('rendering of a headless launch', () => {
  it('turns hardware acceleration off so offscreen frames never need a GPU', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--no-focus', '--muted', '--review']);
    expect(app.disableHardwareAcceleration).toHaveBeenCalledTimes(1);
  });

  it('lets WebGL draw on SwiftShader so a hidden canvas is never blank', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--no-focus', '--muted', '--review']);
    expect(app.commandLine.appendSwitch).toHaveBeenCalledWith('enable-unsafe-swiftshader');
  });

  it('appends the SwiftShader switch once when two pins ask for it', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--review']);
    pinHeadlessRendering(flags, ['electron', '.', '--review']);
    expect(app.commandLine.appendSwitch).toHaveBeenCalledTimes(1);
  });

  it('keeps hardware acceleration in a hidden launch given --gpu', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--no-focus', '--review', '--gpu']);
    expect(app.disableHardwareAcceleration).not.toHaveBeenCalled();
    expect(app.commandLine.appendSwitch).not.toHaveBeenCalled();
  });

  it('keeps hardware acceleration for a normal launch', () => {
    pinHeadlessRendering(flags, ['electron', '.']);
    expect(app.disableHardwareAcceleration).not.toHaveBeenCalled();
    expect(app.commandLine.appendSwitch).not.toHaveBeenCalled();
  });

  it('keeps hardware acceleration for a visible automation launch', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--review', '--visible']);
    expect(app.disableHardwareAcceleration).not.toHaveBeenCalled();
  });
});
