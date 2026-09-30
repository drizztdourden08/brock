/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { Rectangle } from 'electron';
import type { WindowPlan } from '../window/create-window.type';
import { offscreenOrigin } from '../window/offscreen-origin';

const targetDisplay = ({ startup, saved }: WindowPlan): Electron.Display => {
  if (startup.windowSize || saved.x === undefined || saved.y === undefined) return screen.getPrimaryDisplay();
  return screen.getDisplayMatching({ x: saved.x, y: saved.y, width: saved.width, height: saved.height });
};

const splashBounds = (plan: WindowPlan, size: { width: number; height: number }): Rectangle => {
  if (plan.headless) return { ...offscreenOrigin(), ...size };
  const { workArea } = targetDisplay(plan);
  return {
    x: Math.round(workArea.x + (workArea.width - size.width) / 2),
    y: Math.round(workArea.y + (workArea.height - size.height) / 2),
    ...size,
  };
};

export { splashBounds };
