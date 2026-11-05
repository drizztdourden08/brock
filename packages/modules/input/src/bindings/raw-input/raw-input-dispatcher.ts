/* @layer renderer-shell @kind logic */
import type { InputBinding } from '../bindings.type';
import { padHexOrNull } from '../device-keys/pad-hex-or-null';
import { axisDirection } from './axis-direction';
import { resolveAxisPressThreshold } from './resolve-axis-press-threshold';
import type { AxisDirection, PadStateSnapshot, RawInputEvent, RawInputListener } from './raw-input.type';

class RawInputDispatcher {
  private listeners = new Set<RawInputListener>();
  private prevButtons = new Map<string, boolean[]>();
  private prevAxes = new Map<string, AxisDirection[]>();

  get hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  subscribe(listener: RawInputListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(binding: InputBinding, sourceDeviceKey: string, vendorId: string | null = null, productId: string | null = null): void {
    if (this.listeners.size === 0) return;
    const event: RawInputEvent = { binding, sourceDeviceKey, vendorId, productId };
    for (const fn of this.listeners) {
      try { fn(event); } catch { continue; }
    }
  }

  emitStates(states: ReadonlyMap<string, PadStateSnapshot>): void {
    for (const [deviceKey, state] of states) {
      const [vidPart, pidPart] = deviceKey.split(':');
      const vid = padHexOrNull(vidPart);
      const pid = padHexOrNull(pidPart);
      this.emitButtonEdges(deviceKey, state.buttons, vid, pid);
      const currAxes = this.emitAxisEdges(deviceKey, state.axes, vid, pid);
      this.prevButtons.set(deviceKey, [...state.buttons]);
      this.prevAxes.set(deviceKey, currAxes);
    }
  }

  removeDevice(deviceKey: string): void {
    this.prevButtons.delete(deviceKey);
    this.prevAxes.delete(deviceKey);
  }

  private emitButtonEdges(deviceKey: string, buttons: readonly boolean[], vid: string | null, pid: string | null): void {
    const prev = this.prevButtons.get(deviceKey) ?? [];
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i] && !prev[i]) this.emit({ type: 'gamepad-button', index: i }, deviceKey, vid, pid);
    }
  }

  private emitAxisEdges(deviceKey: string, axes: readonly number[], vid: string | null, pid: string | null): AxisDirection[] {
    const prev = this.prevAxes.get(deviceKey) ?? [];
    const curr: AxisDirection[] = [];
    for (const [i, val] of axes.entries()) {
      const dir = axisDirection(val, resolveAxisPressThreshold(i, deviceKey));
      curr[i] = dir;
      if (dir !== null && dir !== prev[i]) this.emit({ type: 'gamepad-axis', axisIndex: i, direction: dir }, deviceKey, vid, pid);
    }
    return curr;
  }
}

export { RawInputDispatcher };
