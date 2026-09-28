/* @layer core @kind types */
import type { AssetExtractor, AssetPacker } from '../assets/asset-pipeline.type';
import type { RomDefinition } from '../rom/rom.type';

interface CoreCalls {
  call: (name: string, ...args: number[]) => void;
  number: (name: string, ...args: number[]) => number;
  has: (name: string) => boolean;
  heap: () => Uint8Array;
}

interface CoreFiles {
  assets: string;
  config?: string;
  sram: string;
  state: string;
  scratchSlot: number;
}

interface CoreExports {
  stop: string;
  pause?: string;
  reset?: string;
  initHeadless?: string;
  runFrame?: string;
  setInput?: string;
  saveSram?: string;
  saveState?: string;
  loadState?: string;
}

interface CoreDefinition {
  glue: string;
  wasm: string;
  factory: string;
  files: CoreFiles;
  exports: CoreExports;
}

interface EmscriptenVideo {
  mode: 'emscripten';
  context: 'webgl' | 'webgl2' | '2d';
}

interface FramebufferVideo {
  mode: 'framebuffer';
  width: number;
  height: number;
  frame: string;
  fps?: number;
}

type VideoDefinition = EmscriptenVideo | FramebufferVideo;

interface EmscriptenAudio {
  mode: 'emscripten-sdl';
}

interface SampleAudio {
  mode: 'samples';
  sampleRate: number;
  channels: 1 | 2;
  samples: string;
  count: string;
}

type AudioDefinition = EmscriptenAudio | SampleAudio;

interface LiveSettingsDefinition<S> {
  apply: (settings: S, core: CoreCalls) => void;
}

interface AssetsDefinition {
  extension: string;
  extractors: AssetExtractor[];
  pack?: AssetPacker;
}

interface SavesDefinition {
  quickSlots: number;
  sramSyncMs?: number;
}

interface PortDefinition<S = never> {
  id: string;
  core: CoreDefinition;
  rom: RomDefinition;
  video: VideoDefinition;
  audio: AudioDefinition;
  saves: SavesDefinition;
  settings?: LiveSettingsDefinition<S>;
  assets?: AssetsDefinition;
}

export type {
  CoreCalls, CoreFiles, CoreExports, CoreDefinition, EmscriptenVideo, FramebufferVideo, VideoDefinition,
  EmscriptenAudio, SampleAudio, AudioDefinition, LiveSettingsDefinition, AssetsDefinition, SavesDefinition,
  PortDefinition,
};
