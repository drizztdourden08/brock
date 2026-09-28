/* @layer electron-main @kind types */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { DeviceEntry, HidListedDevice } from '../device.type';
import type { Sdl3Input } from './sdl3.type';

interface ControllerSource {
  start: () => void;
  stop: () => void;
  rescan: () => void;
  rumble: (deviceKey: string, low: number, high: number, durationMs: number) => boolean;
  snapshot: () => DeviceEntry[];
  listed: () => HidListedDevice[];
}

type SourceInput = Pick<MainContext, 'emit' | 'log'> & { addon: Sdl3Input };

export type { ControllerSource, SourceInput };
