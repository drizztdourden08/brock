/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';

const portKitRenderer: RendererModule = {
  id: 'port-kit',
};

export default portKitRenderer;
export { portKitRenderer };
export { portKitApi } from './port-kit-api';

export { runAssetWebWorkerJob } from './assets/run-asset-web-worker-job';
export type { AssetWebWorkerJobOptions, AssetWebWorkerSource } from './assets/asset-web-worker-job.type';
export type { AssetWorkerStepDef } from '../assets/worker/asset-worker.type';

export { createGameCore } from './core/create-game-core';
export { compileCore } from './core/compile-core';
export { createCoreCalls } from './core/create-core-calls';
export { watchCoreCrash } from './core/watch-core-crash';
export { useCoreState } from './core/useCoreState';
export type {
  CoreStatus, CoreState, CoreListener, CoreLog, CoreBoot, CoreCrash, PrecompiledCore, CrashWatchFrom, GameCoreOptions, CoreControls, GameCore,
} from './core/game-core.type';
export type {
  EmscriptenFS, SdlAudio, EmscriptenModule, EmscriptenConfig, EmscriptenFactory,
} from './core/emscripten.type';

export { createFrameLoop } from './frame/create-frame-loop';
export { createFramePresenter } from './frame/create-frame-presenter';
export { createHostLoop } from './frame/create-host-loop';
export { captureFrame } from './frame/capture-frame';
export type { FrameLoopOptions, FrameLoop, FramePresenter, FrameSize } from './frame/frame.type';

export { createAudioAdapter } from './audio/create-audio-adapter';
export { attachSdlAudio } from './audio/attach-sdl-audio';
export type { AudioOutput, SampleBlock, AudioAdapter } from './audio/audio.type';

export { createLiveSettings } from './settings/create-live-settings';
export type { LiveSettings, LiveSettingsCalls, LiveSettingsTarget } from './settings/live-settings.type';

export { createSramSync } from './saves/create-sram-sync';
export { createSaveSlots } from './saves/create-save-slots';
export type { SramSource, SramSyncOptions, SramSync, SaveTransform, SaveSlotsOptions, SaveSlots } from './saves/save-session.type';

export { createPortSession } from './session/create-port-session';
export type { PortSessionOptions, PortSession } from './session/port-session.type';

export { GameCanvas } from './components/GameCanvas';
export type { GameCanvasProps } from './components/GameCanvas';
export { RomPicker } from './components/RomPicker';
export type { DroppedRom, RomPickerProps } from './components/RomPicker';
