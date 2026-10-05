/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { TOUR_SPOT_SCRIPT } from './widget-windows.constants';

const tourSpotLit = async (win: BrowserWindow | null): Promise<boolean> => {
  if (!win) return false;
  try {
    return (await win.webContents.executeJavaScript(TOUR_SPOT_SCRIPT)) === true;
  } catch {
    return false;
  }
};

export { tourSpotLit };
