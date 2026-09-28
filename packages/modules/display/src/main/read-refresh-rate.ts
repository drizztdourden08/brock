/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { RefreshRateInfo } from '../display.type';
import type { DisplayModeDriver } from './drivers/display-mode-driver.type';

const readRefreshRate = (win: BrowserWindow | null, driver: DisplayModeDriver): RefreshRateInfo => {
  try {
    const display = win ? screen.getDisplayMatching(win.getBounds()) : screen.getPrimaryDisplay();
    const hz = display.displayFrequency;
    const modes = driver.available ? driver.listRates().map((rate) => ({ hz: rate, sameResolution: true })) : [];
    return { reportedHz: hz > 0 ? hz : null, measuredHz: null, modes };
  } catch {
    return { reportedHz: null, measuredHz: null, modes: [] };
  }
};

export { readRefreshRate };
