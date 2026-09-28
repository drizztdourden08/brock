/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { Display } from 'electron';
import type { MonitorInfo } from '../../display.type';

const toMonitor = (display: Display, index: number, primaryId: number): MonitorInfo => ({
  id: String(display.id),
  label: display.label || `Display ${index + 1}`,
  primary: display.id === primaryId,
  width: Math.round(display.size.width * display.scaleFactor),
  height: Math.round(display.size.height * display.scaleFactor),
  scaleFactor: display.scaleFactor,
  refreshHz: display.displayFrequency > 0 ? display.displayFrequency : null,
});

const listMonitors = (): MonitorInfo[] => {
  const primaryId = screen.getPrimaryDisplay().id;
  return screen.getAllDisplays().map((display, index) => toMonitor(display, index, primaryId));
};

export { listMonitors };
