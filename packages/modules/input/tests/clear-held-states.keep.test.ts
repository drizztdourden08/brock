/* @layer renderer-shell @kind test */
import { describe, expect, it, vi } from 'vitest';
import { clearHeldStates } from '../src/controller-input/clear-held-states';
import type { ControllerInputState } from '../src/runtime/controller-input-store.type';
import type { ControllerStateHost } from '../src/runtime/process-controller-state.type';

const heldPad = (deviceKey: string): ControllerInputState => ({
  deviceKey,
  buttons: [true, false, true],
  axes: [0.8, -0.6, 0, 0, 1, 0.5],
  timestamp: 1,
});

const hostWith = (...pads: ControllerInputState[]): ControllerStateHost => ({
  states: new Map(pads.map((pad) => [pad.deviceKey, pad])),
  listeners: new Set(),
  connectedDeviceKeys: new Set(pads.map((pad) => pad.deviceKey)),
  connected: pads.length > 0,
  log: () => undefined,
});

describe('K1 held input across a release of the gamepad subsystem', { tags: ['critical'] }, () => {
  it('lets go of every button and axis of every pad', () => {
    const host = hostWith(heldPad('a'), heldPad('b'));
    clearHeldStates(host);
    for (const key of ['a', 'b']) {
      const state = host.states.get(key);
      expect(state?.buttons).toEqual([false, false, false]);
      expect(state?.axes).toEqual([0, 0, 0, 0, 0, 0]);
    }
  });

  it('tells each listener once per pad that the pad is idle', () => {
    const host = hostWith(heldPad('a'), heldPad('b'));
    const listener = vi.fn();
    host.listeners.add(listener);
    clearHeldStates(host);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.calls.every(([state]: [ControllerInputState]) => state.buttons.every((down) => !down))).toBe(true);
  });

  it('does not change what is connected', () => {
    const host = hostWith(heldPad('a'));
    clearHeldStates(host);
    expect(host.connectedDeviceKeys.has('a')).toBe(true);
    expect(host.connected).toBe(true);
  });

  it('does nothing without a pad', () => {
    const host = hostWith();
    const listener = vi.fn();
    host.listeners.add(listener);
    clearHeldStates(host);
    expect(listener).not.toHaveBeenCalled();
  });
});
