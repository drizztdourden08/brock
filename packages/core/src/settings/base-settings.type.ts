/* @layer core @kind types */
type WindowMode = 'windowed' | 'borderless' | 'fullscreen';

type KeymapOverrides = Readonly<Record<string, readonly string[]>>;

interface BaseSettings {
  windowMode: WindowMode;
  startFullscreen: boolean;
  enableAudio: boolean;
  masterVolume: number;
  developerToolsEnabled: boolean;
  allowDebugLogging: boolean;
  keymap?: KeymapOverrides;
}

export type { BaseSettings, KeymapOverrides, WindowMode };
