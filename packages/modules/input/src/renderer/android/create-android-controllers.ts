/* @layer renderer-shell @kind logic */
import { listenNative } from '@drizztdourden08/brock-core';
import type { ControllerAddedInfo, ControllerStateListener, DeviceEntry, InputStatus } from '../../device.type';
import type { AndroidControllers, AndroidInputEvent, BrockInputPlugin, MappingStore } from './android-input.type';
import { CONTROLLER_EVENT, INPUT_OFF } from './android-input.constants';
import { busOfConnection } from './bus-of-connection';
import { createAndroidRegistry } from './create-android-registry';
import { createEmitter } from './create-emitter';

const createAndroidControllers = (plugin: BrockInputPlugin, mappings: MappingStore): AndroidControllers => {
  const registry = createAndroidRegistry();
  let started: Promise<InputStatus> | null = null;
  const start = (): Promise<InputStatus> => {
    started ??= boot();
    return started;
  };
  const added = createEmitter<[ControllerAddedInfo]>(() => { void start(); });
  const removed = createEmitter<[string]>(() => { void start(); });
  const state = createEmitter<Parameters<ControllerStateListener>>(() => { void start(); });
  const devices = createEmitter<[DeviceEntry[]]>(() => { void start(); });

  const route = (event: AndroidInputEvent): void => {
    if (event.type === 'state') {
      const deviceKey = registry.keyFor(event.id);
      if (deviceKey) state.emit(deviceKey, event.buttons, event.axes);
      return;
    }
    if (event.type === 'added') {
      const { mapping: _mapping, ...device } = registry.add(event);
      added.emit({ ...device, busType: busOfConnection(device.connectionState) });
    } else {
      const deviceKey = registry.remove(event.id);
      if (!deviceKey) return;
      removed.emit(deviceKey);
    }
    devices.emit(registry.snapshot());
  };

  const boot = async (): Promise<InputStatus> => {
    const stopListening = listenNative(plugin, CONTROLLER_EVENT, route);
    const result = await plugin.start().catch(() => ({ ok: false, version: undefined }));
    if (!result.ok) {
      stopListening();
      return INPUT_OFF;
    }
    await mappings.replay();
    return { available: true, sdlVersion: result.version ?? null };
  };

  return { start, registry, added, removed, state, devices };
};

export { createAndroidControllers };
