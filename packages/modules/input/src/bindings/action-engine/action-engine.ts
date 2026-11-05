/* @layer renderer-shell @kind logic */
import type { ActionBinding } from '../bindings.type';
import type { AllowedDevices, DeviceScopedMap } from '../device-keys/device-keys.type';
import { deviceKeyFor } from '../device-keys/device-key-for';
import { scopedEntries } from '../device-keys/scoped-entries';
import { setScoped } from '../device-keys/set-scoped';
import { mergeGlobalDefaults } from '../profile/merge-global-defaults';
import { axisPressed } from '../raw-input/axis-pressed';
import type { PadStateSnapshot } from '../raw-input/raw-input.type';
import { resolveAxisPressThreshold } from '../raw-input/resolve-axis-press-threshold';
import { actionKeyId } from './action-key-id';
import type { ActionKeyUpListener } from './action-engine.type';

class ActionEngine {
  private mappings: ActionBinding[] = [];
  private keyMap = new Map<string, string>();
  private codeToKeyIds = new Map<string, string[]>();
  private buttonMap: DeviceScopedMap<number, string> = new Map();
  private axisMap: DeviceScopedMap<string, string> = new Map();
  private callbacks = new Map<string, () => void>();
  private keyUpListeners = new Set<ActionKeyUpListener>();
  private heldPadInputs = new Set<string>();
  private heldActions = new Set<string>();

  get hasMappedGamepadInputs(): boolean {
    return this.buttonMap.size > 0 || this.axisMap.size > 0;
  }

  setMappings(mappings: readonly ActionBinding[], defaults: readonly ActionBinding[]): void {
    this.mappings = mergeGlobalDefaults(mappings, defaults);
    this.rebuild();
  }

  getMappings(): ActionBinding[] {
    return this.mappings;
  }

  onAction(action: string, callback: () => void): () => void {
    this.callbacks.set(action, callback);
    return () => this.callbacks.delete(action);
  }

  onKeyUp(listener: ActionKeyUpListener): () => void {
    this.keyUpListeners.add(listener);
    return () => this.keyUpListeners.delete(listener);
  }

  clearHeld(): void {
    this.heldPadInputs.clear();
    const held = [...this.heldActions];
    this.heldActions.clear();
    for (const action of held) this.fireKeyUp(action);
  }

  handleKeyDown(code: string, flags: { shift: boolean; ctrl: boolean; alt: boolean }): boolean {
    const action = this.keyMap.get(actionKeyId(code, flags));
    if (!action) return false;
    this.fireAction(action);
    return true;
  }

  handleKeyUp(code: string): void {
    for (const keyId of this.codeToKeyIds.get(code) ?? []) {
      const action = this.keyMap.get(keyId);
      if (action) this.fireKeyUp(action);
    }
  }

  checkGamepads(states: ReadonlyMap<string, PadStateSnapshot>, allowed: AllowedDevices): void {
    for (const [deviceKey, state] of states) {
      if (allowed.gamepadKeys.has(deviceKey)) this.processDeviceState(deviceKey, state);
    }
  }

  private processDeviceState(deviceKey: string, state: PadStateSnapshot): void {
    for (const [index, action] of scopedEntries(this.buttonMap, deviceKey)) {
      if (index < state.buttons.length) this.edge(state.buttons[index] ?? false, `${deviceKey}:btn:${index}`, action);
    }
    for (const [axisKey, action] of scopedEntries(this.axisMap, deviceKey)) {
      const [axisStr, dir] = axisKey.split(':');
      const axisIndex = parseInt(axisStr ?? '', 10);
      if (axisIndex >= state.axes.length) continue;
      const active = axisPressed(state.axes[axisIndex], dir, resolveAxisPressThreshold(axisIndex, deviceKey));
      this.edge(active, `${deviceKey}:axis:${axisKey}`, action);
    }
  }

  private edge(active: boolean, holdKey: string, action: string): void {
    const held = this.heldPadInputs.has(holdKey);
    if (active && !held) {
      this.heldPadInputs.add(holdKey);
      this.fireAction(action);
    } else if (!active && held) {
      this.heldPadInputs.delete(holdKey);
      this.fireKeyUp(action);
    }
  }

  private rebuild(): void {
    this.keyMap.clear();
    this.codeToKeyIds.clear();
    this.buttonMap.clear();
    this.axisMap.clear();
    for (const mapping of this.mappings) this.register(mapping);
  }

  private register(mapping: ActionBinding): void {
    const { binding, action } = mapping;
    if (binding.type === 'keyboard') {
      const keyId = actionKeyId(binding.code, binding.modifiers);
      this.keyMap.set(keyId, action);
      this.codeToKeyIds.set(binding.code, [...(this.codeToKeyIds.get(binding.code) ?? []), keyId]);
      return;
    }
    const deviceKey = deviceKeyFor(mapping.sourceVid, mapping.sourcePid);
    if (binding.type === 'gamepad-button') setScoped(this.buttonMap, deviceKey, binding.index, action);
    if (binding.type === 'gamepad-axis') setScoped(this.axisMap, deviceKey, `${binding.axisIndex}:${binding.direction}`, action);
  }

  private fireAction(action: string): void {
    this.heldActions.add(action);
    this.callbacks.get(action)?.();
  }

  private fireKeyUp(action: string): void {
    this.heldActions.delete(action);
    for (const fn of this.keyUpListeners) {
      try { fn(action); } catch { continue; }
    }
  }
}

export { ActionEngine };
