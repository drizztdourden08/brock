/* @layer electron-main @kind types */
import type { InputStatus } from '../device.type';
import type { CalibrationStore } from '../calibration/calibration-store.type';
import type { ControllerSource } from './controller-source.type';
import type { HapticPlayer } from '../haptics/haptic-player.type';
import type { MappingDb } from './mapping-db.type';
import type { Sdl3Input } from './sdl3.type';

interface InputOptions {
  addonPath?: string;
  mappingDbPath?: string;
}

interface InputRuntime {
  addon: Sdl3Input;
  status: () => InputStatus;
  source: ControllerSource;
  haptics: HapticPlayer;
  mappings: MappingDb;
}

interface InputMain {
  configure: (options: InputOptions) => void;
  runtime: () => InputRuntime;
  calibration: CalibrationStore;
  start: () => Promise<void>;
  stop: () => void;
}

export type { InputOptions, InputRuntime, InputMain };
