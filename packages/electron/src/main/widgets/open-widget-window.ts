/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { keepWindowInBackground } from '../window/keep-in-background';
import { loadRendererPage } from '../window/load-renderer';
import { applyWindowSecurity } from '../window/security';
import { alignToLink } from './align-to-link';
import { attachWidgetWindow } from './attach-widget-window';
import { widgetWindowControl } from './widget-window-control';
import { widgetWindowEntries } from './widget-window-entries';
import { widgetWindowOptions } from './widget-window-options';
import { WIDGET_QUERY_KEY } from './widget-windows.constants';
import type { WidgetWindowSetup } from './widget-windows.type';

const reuseExisting = (setup: WidgetWindowSetup, id: string, popped?: WidgetWindowOpen): boolean => {
  const existing = widgetWindowEntries.get(id);
  if (!existing || existing.win.isDestroyed()) return false;
  if (existing.closing) {
    existing.win.once('closed', () => openWidgetWindow(setup, id, popped));
    return true;
  }
  if (popped?.seq !== undefined) existing.seq = popped.seq;
  if (!setup.headless && existing.win.isVisible()) existing.win.moveTop();
  return true;
};

const openWidgetWindow = (setup: WidgetWindowSetup, id: string, popped?: WidgetWindowOpen): void => {
  if (reuseExisting(setup, id, popped)) return;
  const win = new BrowserWindow(widgetWindowOptions(setup, id, popped));
  const entry = widgetWindowControl.register(id, win, popped);
  if (setup.muted) win.webContents.setAudioMuted(true);
  if (setup.headless) keepWindowInBackground(win);
  applyWindowSecurity(win, setup.security);
  attachWidgetWindow(id, win, entry);
  alignToLink(entry);
  win.once('ready-to-show', () => {
    if (!entry.parked && !entry.hiddenWithApp && !win.isDestroyed()) win.showInactive();
  });
  loadRendererPage(win, setup.renderer, { [WIDGET_QUERY_KEY]: id });
};

export { openWidgetWindow };
