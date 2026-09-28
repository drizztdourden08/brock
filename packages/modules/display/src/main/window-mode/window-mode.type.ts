/* @layer electron-main @kind types */
import type { Rectangle } from 'electron';
import type { WindowMode } from '@drizztdourden08/brock-core/settings';
import type { WindowModeState } from '../../display.type';

interface WindowModeRuntime {
  mode: WindowMode;
  windowedBounds: Rectangle | null;
  lastError: string;
}

interface WindowModeControl {
  read: () => WindowModeState;
  apply: (mode: WindowMode, monitorId: string | null) => WindowModeState;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export type { WindowModeRuntime, WindowModeControl };
