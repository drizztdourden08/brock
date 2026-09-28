/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';

const portKitRenderer: RendererModule = {
  id: 'port-kit',
};

export default portKitRenderer;
export { portKitRenderer };
export { portKitApi } from './port-kit-api';

export { createGameCore } from './core/create-game-core';
export { useCoreState } from './core/useCoreState';
export type { CoreStatus, CoreState, CoreListener, CoreLog, CoreBoot, CoreControls, GameCore } from './core/game-core.type';
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
export type { LiveSettings } from './settings/live-settings.type';

export { createSramSync } from './saves/create-sram-sync';
export { createSaveSlots } from './saves/create-save-slots';
export type { SramSyncOptions, SramSync, SaveSlotsOptions, SaveSlots } from './saves/save-session.type';

export { createPortSession } from './session/create-port-session';
export type { PortSessionOptions, PortSession } from './session/port-session.type';

export { GameCanvas } from './components/GameCanvas';
export type { GameCanvasProps } from './components/GameCanvas';
export { RomPicker } from './components/RomPicker';
export type { DroppedRom, RomPickerProps } from './components/RomPicker';
