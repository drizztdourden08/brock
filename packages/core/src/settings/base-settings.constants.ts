/* @layer core @kind constants */
import type { BaseSettings } from './base-settings.type';

const DEFAULT_BASE_SETTINGS: BaseSettings = {
  windowMode: 'windowed',
  startFullscreen: false,
  enableAudio: true,
  masterVolume: 1,
  developerToolsEnabled: false,
  allowDebugLogging: false,
};

export { DEFAULT_BASE_SETTINGS };
