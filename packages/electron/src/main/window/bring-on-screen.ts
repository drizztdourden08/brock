/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { windowOpener } from '../background/window-opener';
import { bootState } from '../boot/boot-state';
import { onScreenOverride } from './on-screen-override';

const bringOnScreen = async (hidden: BrowserWindow): Promise<void> => {
  const open = windowOpener.current;
  if (!open) return;
  onScreenOverride.forced = true;
  bootState.headless = false;
  try {
    await open();
  } catch (error) {
    onScreenOverride.forced = false;
    bootState.headless = true;
    throw error;
  }
  if (!hidden.isDestroyed()) hidden.destroy();
};

export { bringOnScreen };
