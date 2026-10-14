/* @layer renderer-shell @kind logic */
import type { WindowControlsPort } from '@drizztdourden08/brock-core';
import { capacitorPlugins } from './capacitor-plugins';

const ignore = (): void => undefined;
const noUnsub = (): (() => void) => ignore;
const no = (): Promise<boolean> => Promise.resolve(false);

const createCapacitorWindow = (): WindowControlsPort => ({
  minimize: ignore,
  toggleMaximize: ignore,
  close: () => { capacitorPlugins.app()?.exitApp().catch(ignore); },
  toggleFullscreen: ignore,
  setFullscreen: ignore,
  setAspectRatioLock: ignore,
  setAlwaysOnTop: no,
  openDevTools: ignore,
  isMaximized: no,
  isFullscreen: no,
  onMaximizedChange: noUnsub,
  onFullscreenChange: noUnsub,
});

export { createCapacitorWindow };
