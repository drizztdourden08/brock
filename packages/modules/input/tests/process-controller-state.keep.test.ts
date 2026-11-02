/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { IDENTITY_STICK } from '../src/calibration/calibration.constants';
import type { DeviceStickCalibration } from '../src/calibration.type';
import { processControllerState } from '../src/controller-input/process-controller-state';
import { useCalibrationStore } from '../src/renderer/useCalibrationStore';
import type { ControllerInputState } from '../src/runtime/controller-input-store.type';
import type { ControllerStateHost } from '../src/runtime/process-controller-state.type';

const DEVICE = '045e:028e';

const hostOf = (): ControllerStateHost => ({
  states: new Map<string, ControllerInputState>(),
  listeners: new Set(),
  connectedDeviceKeys: new Set<string>(),
  connected: false,
  log: () => undefined,
});

const stickCalibration = (): DeviceStickCalibration => ({ left: IDENTITY_STICK, right: IDENTITY_STICK, updatedAt: 'now' });

const axesAfter = (axes: number[]): number[] => {
  const host = hostOf();
  processControllerState(host, DEVICE, [], axes);
  return host.states.get(DEVICE)?.axes ?? [];
};

describe('K1 stick calibration and dead zone on a controller report', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useCalibrationStore.setState({ sticks: {}, triggers: {} });
  });

  it('passes the sticks through when none is calibrated', () => {
    expect(axesAfter([0.05, 0.05, 0.5, -0.5, 0, 0])).toEqual([0.05, 0.05, 0.5, -0.5, 0, 0]);
  });

  it('zeroes a stick inside the inner dead zone', () => {
    useCalibrationStore.setState({ sticks: { [DEVICE]: stickCalibration() } });
    expect(axesAfter([0.05, 0.05, -0.04, 0.06, 0, 0]).slice(0, 4)).toEqual([0, 0, 0, 0]);
  });

  it('rescales a stick radially outside the dead zone', () => {
    useCalibrationStore.setState({ sticks: { [DEVICE]: stickCalibration() } });
    const [x, y] = axesAfter([0.5, 0, 0, 0, 0, 0]);
    expect(x).toBeCloseTo((0.5 - 0.1) / (0.95 - 0.1));
    expect(y).toBeCloseTo(0);
  });

  it('keeps the direction of a diagonal push on both sticks', () => {
    useCalibrationStore.setState({ sticks: { [DEVICE]: stickCalibration() } });
    const [lx, ly, rx, ry] = axesAfter([0.4, -0.4, -0.3, 0.3, 0, 0]);
    expect(Math.abs(lx ?? 0)).toBeCloseTo(Math.abs(ly ?? 1));
    expect(lx).toBeGreaterThan(0);
    expect(ly).toBeLessThan(0);
    expect(rx).toBeLessThan(0);
    expect(ry).toBeGreaterThan(0);
  });

  it('uses the saved range and centre of each stick', () => {
    const left = { ...IDENTITY_STICK, centerX: 0.2, maxX: 0.6, innerDeadzone: 0, outerDeadzone: 1 };
    useCalibrationStore.setState({ sticks: { [DEVICE]: { left, right: IDENTITY_STICK, updatedAt: 'now' } } });
    expect(axesAfter([0.6, 0, 0, 0, 0, 0])[0]).toBeCloseTo(1);
  });

  it('ignores the calibration of another device', () => {
    useCalibrationStore.setState({ sticks: { '1234:5678': stickCalibration() } });
    expect(axesAfter([0.05, 0.05, 0, 0, 0, 0]).slice(0, 2)).toEqual([0.05, 0.05]);
  });

  it('still calibrates the triggers beside the sticks', () => {
    useCalibrationStore.setState({
      sticks: { [DEVICE]: stickCalibration() },
      triggers: { [`${DEVICE}:4`]: { base: 0, max: 0.5, deadzone: 0 } },
    });
    expect(axesAfter([0, 0, 0, 0, 0.25, 0])[4]).toBeCloseTo(0.5);
  });

  it('reports the raw sticks beside the calibrated ones', () => {
    useCalibrationStore.setState({ sticks: { [DEVICE]: stickCalibration() } });
    const host = hostOf();
    processControllerState(host, DEVICE, [], [0.05, 0.05, 0.5, -0.5, 0, 0]);
    expect(host.states.get(DEVICE)?.rawSticks).toEqual([0.05, 0.05, 0.5, -0.5]);
  });
});
