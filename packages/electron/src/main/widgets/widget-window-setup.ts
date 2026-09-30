/* @layer electron-main @kind logic */
import { is } from '@electron-toolkit/utils';
import type { WindowPlan } from '../window/create-window.type';
import type { WindowSetup } from '../window/window-setup.type';
import { startupRendererArgs } from '../window/startup-renderer-args';
import type { WidgetWindowSetup } from './widget-windows.type';

const widgetWindowSetup = (setup: WindowSetup, plan: WindowPlan): WidgetWindowSetup => {
  const { product, flags, instance, paths, icon, rendererFlags, security } = setup;
  return {
    headless: plan.headless,
    muted: process.argv.includes('--muted'),
    title: plan.title,
    renderer: paths.renderer,
    security,
    base: {
      icon,
      backgroundColor: product.window.backgroundColor,
      webPreferences: {
        preload: paths.preload,
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        backgroundThrottling: false,
        additionalArguments: startupRendererArgs({ config: plan.startup, flags, instance, isDev: is.dev, rendererFlags }),
      },
    },
  };
};

export { widgetWindowSetup };
