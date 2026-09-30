/* @layer electron-main @kind logic */
import { app, BrowserWindow } from 'electron';
import { loadRendererPage } from '../window/load-renderer';
import { keepWindowInBackground } from '../window/keep-in-background';
import { bootState } from './boot-state';
import { installSplashActions } from './install-splash-actions';
import { replaySplash } from './replay-splash';
import { splashBounds } from './splash-bounds';
import type { SplashSetup } from './splash-setup.type';

const openSplash = ({ plan, size, title, version, backgroundColor, icon, pagePath, preloadPath }: SplashSetup): BrowserWindow => {
  const splash = new BrowserWindow({
    ...splashBounds(plan, size),
    title,
    icon,
    frame: false,
    roundedCorners: false,
    hasShadow: false,
    thickFrame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    focusable: !plan.headless,
    skipTaskbar: plan.headless,
    show: false,
    backgroundColor,
    webPreferences: { preload: preloadPath, sandbox: false, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false },
  });
  bootState.splash = splash;
  bootState.headless = plan.headless;
  installSplashActions();
  if (plan.headless) keepWindowInBackground(splash);

  splash.webContents.on('did-finish-load', replaySplash);
  splash.once('ready-to-show', () => {
    if (plan.headless) splash.showInactive();
    else splash.show();
  });
  splash.once('closed', () => {
    if (bootState.splash === splash) bootState.splash = null;
    bootState.timeline.splashClosedAt ??= Date.now();
    if (!bootState.revealed && !bootState.revealing) app.quit();
  });
  loadRendererPage(splash, pagePath, { v: version });
  return splash;
};

export { openSplash };
