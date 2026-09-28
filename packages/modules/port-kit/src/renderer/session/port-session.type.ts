/* @layer renderer-shell @kind types */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { AssetProgress } from '../../assets/asset-pipeline.type';
import type { SramStore } from '../../saves/save-store.type';
import type { AudioAdapter } from '../audio/audio.type';
import type { CoreLog, GameCore } from '../core/game-core.type';
import type { FrameLoop, FramePresenter } from '../frame/frame.type';
import type { SaveSlots, SramSync } from '../saves/save-session.type';
import type { LiveSettings } from '../settings/live-settings.type';

interface PortSessionOptions<S> {
  core: GameCore<S>;
  canvas: HTMLCanvasElement;
  files: FileStore;
  romFile: string;
  profileId?: string | null;
  settings?: S;
  config?: string;
  volume?: number;
  extraFiles?: Record<string, Uint8Array | string>;
  log?: CoreLog;
  onAssetProgress?: AssetProgress;
}

interface AttachRequest {
  core: GameCore;
  canvas: HTMLCanvasElement;
  audio: AudioAdapter;
  sram: SramStore;
  profileId: string | null;
}

interface SessionParts {
  presenter: FramePresenter;
  loop: FrameLoop | null;
  sram: SramSync | null;
  detachAudio: () => void;
}

interface PortSession<S> {
  core: GameCore<S>;
  audio: AudioAdapter;
  settings: LiveSettings<S>;
  saves: () => SaveSlots | null;
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  setPaused: (paused: boolean) => void;
}

export type { PortSessionOptions, AttachRequest, SessionParts, PortSession };
