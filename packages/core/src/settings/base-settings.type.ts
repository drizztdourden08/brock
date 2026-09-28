/* @layer core @kind types */
type WindowMode = 'windowed' | 'borderless' | 'fullscreen';

interface BaseSettings {
  windowMode: WindowMode;
  startFullscreen: boolean;
  enableAudio: boolean;
  masterVolume: number;
  developerToolsEnabled: boolean;
  allowDebugLogging: boolean;
}

export type { BaseSettings, WindowMode };
