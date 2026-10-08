/* @layer electron-main @kind types */
import type { DeviceEntry, HidListedDevice } from '../device.type';
import type { LiveDevice } from '../devices/live-device.type';
import type { Sdl3AddedEvent } from './sdl3.type';

interface ControllerRegistry {
  add: (event: Sdl3AddedEvent) => LiveDevice;
  remove: (sdlId: number) => string | undefined;
  keyFor: (sdlId: number) => string | undefined;
  device: (deviceKey: string) => LiveDevice | undefined;
  busTypeOf: (device: LiveDevice) => HidListedDevice['busType'];
  refreshListed: () => void;
  listed: () => HidListedDevice[];
  snapshot: () => DeviceEntry[];
  clear: () => void;
}

export type { ControllerRegistry };
