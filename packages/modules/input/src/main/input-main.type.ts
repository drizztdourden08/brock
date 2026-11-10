/* @layer electron-main @kind types */
import type { MainContext, MainModule } from '@drizztdourden08/brock-electron/main';
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

type InputMainContext = Pick<MainContext, 'handle' | 'emit' | 'files' | 'paths' | 'log' | 'product'> & {
  flags: Pick<MainContext['flags'], 'isHeadlessLaunch' | 'hasFlag'>;
};

type InputWindow = Parameters<NonNullable<MainModule['onWindow']>>[0];

interface InputMainModule extends MainModule {
  register: (ctx: InputMainContext) => void;
  onWindow: (win: InputWindow, ctx: InputMainContext) => void;
  onWillQuit: (ctx: InputMainContext) => void;
}

export type { InputOptions, InputRuntime, InputMain, InputMainContext, InputMainModule };
