/* @layer electron-main @kind logic */
import { BrowserWindow, screen } from 'electron';
import type { BrowserWindowConstructorOptions } from 'electron';
import { is } from '@electron-toolkit/utils';
import type { WindowSetup } from './window-setup.type';
import type { WindowPlan } from './create-window.type';
import { loadWindowState } from './load-window-state';
import { applyWindowState } from './apply-window-state';
import { trackWindowState } from './track-window-state';
import { parseStartupConfig } from './startup-config';
import { startupRendererArgs } from './startup-renderer-args';
import { keepWindowInBackground } from './keep-in-background';
import { attachTextInteraction } from './text-interaction';
import { attachKeyPassthrough } from './key-passthrough';
import { applyWindowSecurity } from './security';
import { forwardWindowEvents } from './forward-window-events';
import { loadRendererPage } from './load-renderer';
import { setMainWindow } from './set-main-window';
import { armReveal } from '../boot/arm-reveal';
import { openSplash } from '../boot/open-splash';

const offscreenOrigin = (): { x: number; y: number } => {
  const displays = screen.getAllDisplays();
  const right = Math.max(...displays.map((d) => d.bounds.x + d.bounds.width));
  const top = Math.min(...displays.map((d) => d.bounds.y));
  return { x: right + 400, y: top };
};

const holdTitle = (win: BrowserWindow, title: string): void => {
  win.on('page-title-updated', (event) => {
    event.preventDefault();
    win.setTitle(title);
  });
};

const planWindow = ({ product, flags, instance }: WindowSetup): WindowPlan => {
  const { window: config } = product;
  const baseTitle = config.title ?? product.name;
  return {
    headless: flags.isHeadlessLaunch(),
    startup: parseStartupConfig(config.defaultSize),
    saved: loadWindowState(config),
    title: instance.name ? `${baseTitle} - ${instance.name}` : baseTitle,
  };
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
    opacity: headless ? 1 : 0,
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

const presentWindow = (win: BrowserWindow, setup: WindowSetup, plan: WindowPlan): void => {
  const { product, paths, version } = setup;
  const { window: config } = product;
  const { headless, startup, saved } = plan;
  if (headless) {
    if (!startup.windowSize) win.setContentSize(saved.width, saved.height);
    keepWindowInBackground(win);
    win.showInactive();
    return;
  }
  if (startup.windowSize) win.center();
  else applyWindowState(win, saved);
  trackWindowState(win);
  armReveal(win);
  win.show();
  openSplash(win, { version, size: config.splash, backgroundColor: config.backgroundColor, pagePath: paths.splash });
};

const createWindow = (setup: WindowSetup): BrowserWindow => {
  const { flags, instance, paths, security } = setup;
  const plan = planWindow(setup);
  const win = new BrowserWindow(windowOptions(setup, plan));
  setMainWindow(win);
  if (instance.name) holdTitle(win, plan.title);
  presentWindow(win, setup, plan);

  attachKeyPassthrough(win);
  attachTextInteraction(win);
  applyWindowSecurity(win, security);
  forwardWindowEvents(win, !flags.isAutomationLaunch());
  loadRendererPage(win, paths.renderer);
  return win;
};

export { createWindow };
