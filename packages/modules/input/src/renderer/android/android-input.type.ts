/* @layer renderer-shell @kind types */
import type { NativePlugin } from '@drizztdourden08/brock-core';
import type { ControllerAddedInfo, ControllerStateListener, DeviceEntry, InputStatus } from '../../device.type';
import type { LiveDevice } from '../../devices/live-device.type';
import type { Sdl3AddedEvent, Sdl3Event } from '../../main/sdl3.type';

type Unsubscribe = () => void;

type AndroidAddedEvent = Sdl3AddedEvent & { mapping?: string };

type AndroidInputEvent = AndroidAddedEvent | Extract<Sdl3Event, { type: 'removed' | 'state' }>;

interface RumbleRequest {
  id: number;
  low: number;
  high: number;
  durationMs: number;
}

interface BrockInputPlugin extends NativePlugin {
  start: () => Promise<{ ok: boolean; version?: string }>;
  stop: () => Promise<void>;
  rumble: (request: RumbleRequest) => Promise<{ ok: boolean }>;
  addMapping: (request: { mapping: string }) => Promise<{ ok: boolean }>;
  mappingForGuid: (request: { guid: string }) => Promise<{ mapping?: string }>;
}

interface Emitter<A extends unknown[]> {
  on: (listener: (...args: A) => void) => Unsubscribe;
  emit: (...args: A) => void;
}

interface AndroidRegistry {
  add: (event: AndroidAddedEvent) => LiveDevice;
  remove: (sdlId: number) => string | undefined;
  keyFor: (sdlId: number) => string | undefined;
  device: (deviceKey: string) => LiveDevice | undefined;
  snapshot: () => DeviceEntry[];
}

interface AndroidControllers {
  start: () => Promise<InputStatus>;
  registry: AndroidRegistry;
  added: Emitter<[ControllerAddedInfo]>;
  removed: Emitter<[string]>;
  state: Emitter<Parameters<ControllerStateListener>>;
  devices: Emitter<[DeviceEntry[]]>;
}

interface MappingStore {
  add: (line: string) => Promise<boolean>;
  replay: () => Promise<void>;
}

export type {
  AndroidInputEvent, BrockInputPlugin, Emitter, AndroidRegistry,
  AndroidControllers, MappingStore,
};
