/* @layer renderer-shell @kind types */
import type { CoreCalls, PortDefinition } from '../../port/port-definition.type';
import type { EmscriptenFS, EmscriptenModule } from './emscripten.type';

type CoreStatus = 'idle' | 'loading' | 'running' | 'paused' | 'error';

interface CoreState {
  status: CoreStatus;
  error: string | null;
}

type CoreListener = (state: CoreState) => void;

type CoreLog = (line: string, level: 'info' | 'error') => void;

interface CoreBoot {
  assets: Uint8Array;
  canvas?: HTMLCanvasElement | null;
  config?: string;
  sram?: Uint8Array | null;
  extraFiles?: Record<string, Uint8Array | string>;
  log?: CoreLog;
}

interface StateHub {
  get: () => CoreState;
  set: (next: CoreState) => void;
  subscribe: (listener: CoreListener) => () => void;
}

interface CoreControls {
  setPaused: (paused: boolean) => void;
  reset: () => void;
}

interface GameCore<S = never> extends CoreControls {
  definition: PortDefinition<S>;
  start: (boot: CoreBoot) => Promise<void>;
  initHeadless: (boot: Omit<CoreBoot, 'canvas'>) => Promise<void>;
  stop: () => void;
  calls: () => CoreCalls | null;
  fs: () => EmscriptenFS | null;
  module: () => EmscriptenModule | null;
  state: () => CoreState;
  subscribe: (listener: CoreListener) => () => void;
}

export type { CoreStatus, CoreState, CoreListener, CoreLog, CoreBoot, StateHub, CoreControls, GameCore };
