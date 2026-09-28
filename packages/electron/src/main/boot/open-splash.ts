/* @layer electron-main @kind logic */
import { BrowserWindow, screen } from 'electron';
import type { SplashOptions } from './splash-window.type';
import { loadRendererPage } from '../window/load-renderer';
import { splashRef } from './splash-ref';

const splashOrigin = (parent: BrowserWindow, size: SplashOptions['size']): { x: number; y: number } => {
  const { workArea } = screen.getDisplayMatching(parent.getBounds());
  return {
    x: Math.round(workArea.x + (workArea.width - size.width) / 2),
    y: Math.round(workArea.y + (workArea.height - size.height) / 2),
  };
};

const openSplash = (parent: BrowserWindow, { version, size, backgroundColor, pagePath }: SplashOptions): void => {
  const splash = new BrowserWindow({
    parent,
    ...splashOrigin(parent, size),
    width: size.width,
    height: size.height,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    show: false,
    backgroundColor,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  splashRef.current = splash;

  loadRendererPage(splash, pagePath, { v: version });
  splash.once('ready-to-show', () => splashRef.current?.show());
};

export { openSplash };
