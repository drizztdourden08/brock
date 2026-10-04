/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { BACKDROP_COLOR } from './widget-windows.constants';

const clusterBackdrop = (area: WidgetWindowBounds): BrowserWindow => {
  const backdrop = new BrowserWindow({
    ...area,
    frame: false,
    show: false,
    focusable: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    roundedCorners: false,
    backgroundColor: BACKDROP_COLOR,
    title: 'backdrop',
  });
  backdrop.setBounds(area);
  backdrop.showInactive();
  return backdrop;
};

export { clusterBackdrop };
