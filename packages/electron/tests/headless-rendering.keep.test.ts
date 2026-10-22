/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from 'electron';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { pinHeadlessRendering } from '../src/main/window/pin-headless-rendering';

vi.mock('electron', () => ({ app: { disableHardwareAcceleration: vi.fn() } }));

const flags = createAutomationFlags();

beforeEach(() => {
  vi.mocked(app.disableHardwareAcceleration).mockClear();
});

describe('rendering of a headless launch', () => {
  it('turns hardware acceleration off so offscreen frames never need a GPU', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--no-focus', '--muted', '--review']);
    expect(app.disableHardwareAcceleration).toHaveBeenCalledTimes(1);
  });

  it('keeps hardware acceleration for a normal launch', () => {
    pinHeadlessRendering(flags, ['electron', '.']);
    expect(app.disableHardwareAcceleration).not.toHaveBeenCalled();
  });

  it('keeps hardware acceleration for a visible automation launch', () => {
    pinHeadlessRendering(flags, ['electron', '.', '--review', '--visible']);
    expect(app.disableHardwareAcceleration).not.toHaveBeenCalled();
  });
});
