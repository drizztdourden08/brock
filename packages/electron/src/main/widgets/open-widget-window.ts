/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { keepWindowInBackground } from '../window/keep-in-background';
import { loadRendererPage } from '../window/load-renderer';
import { applyWindowSecurity } from '../window/security';
import { attachWidgetWindow } from './attach-widget-window';
import { widgetWindowControl } from './widget-window-control';
import { widgetWindowOptions } from './widget-window-options';
import { WIDGET_QUERY_KEY } from './widget-windows.constants';
import type { WidgetWindowSetup } from './widget-windows.type';

const openWidgetWindow = (setup: WidgetWindowSetup, id: string, popped?: WidgetWindowOpen): void => {
  const existing = widgetWindowControl.windowOf(id);
  if (existing) {
    if (!setup.headless) existing.moveTop();
    return;
  }
  const win = new BrowserWindow(widgetWindowOptions(setup, id, popped));
  const entry = widgetWindowControl.register(id, win, popped);
  if (setup.muted) win.webContents.setAudioMuted(true);
  if (setup.headless) keepWindowInBackground(win);
  applyWindowSecurity(win, setup.security);
  attachWidgetWindow(id, win, entry);
  win.once('ready-to-show', () => win.showInactive());
  loadRendererPage(win, setup.renderer, { [WIDGET_QUERY_KEY]: id });
};

export { openWidgetWindow };
