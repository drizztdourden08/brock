/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type { BrowserWindowConstructorOptions } from 'electron';
import { is } from '@electron-toolkit/utils';
import type { WindowSetup } from './window-setup.type';
import type { WindowPlan } from './create-window.type';
import { startupRendererArgs } from './startup-renderer-args';
import { attachTextInteraction } from './text-interaction';
import { attachKeyPassthrough } from './key-passthrough';
import { applyWindowSecurity } from './security';
import { forwardWindowEvents } from './forward-window-events';
import { loadRendererPage } from './load-renderer';
import { offscreenOrigin } from './offscreen-origin';
import { placeHiddenWindow } from './place-hidden-window';
import { setMainWindow } from './set-main-window';
import { attachAppWindow } from '../boot/attach-app-window';

const holdTitle = (win: BrowserWindow, title: string): void => {
  win.on('page-title-updated', (event) => {
    event.preventDefault();
    win.setTitle(title);
  });
};

const windowOptions = (setup: WindowSetup, plan: WindowPlan): BrowserWindowConstructorOptions => {
  const { product, flags, instance, paths, icon, rendererFlags } = setup;
  const { window: config } = product;
  const { headless, startup, saved, title } = plan;
  return {
    width: startup.windowSize?.width ?? saved.width,
    height: startup.windowSize?.height ?? saved.height,
    minWidth: config.minSize.width,
    minHeight: config.minSize.height,
    ...(headless ? offscreenOrigin() : {}),
    center: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    title,
    icon,
    backgroundColor: config.backgroundColor,
    show: false,
    focusable: !headless,
    paintWhenInitiallyHidden: true,
    webPreferences: {
      preload: paths.preload,
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      additionalArguments: startupRendererArgs({ config: startup, flags, instance, isDev: is.dev, rendererFlags }),
    },
  };
};

const createWindow = (setup: WindowSetup, plan: WindowPlan): BrowserWindow => {
  const { flags, instance, paths, security } = setup;
  const win = new BrowserWindow(windowOptions(setup, plan));
  setMainWindow(win);
  if (instance.name) holdTitle(win, plan.title);
  const present = placeHiddenWindow(win, plan, !flags.isAutomationLaunch());

  attachKeyPassthrough(win);
  attachTextInteraction(win);
  applyWindowSecurity(win, security);
  forwardWindowEvents(win);
  attachAppWindow(win, present);
  loadRendererPage(win, paths.renderer);
  return win;
};

export { createWindow };
