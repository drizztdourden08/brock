/* @layer electron-main @kind logic */
import type { WindowSetup } from './window-setup.type';
import type { WindowPlan } from './create-window.type';
import { loadWindowState } from './load-window-state';
import { parseStartupConfig } from './startup-config';
import { wantsBaselines } from '../review/baselines/wants-baselines';

const planWindow = ({ product, flags, instance }: Pick<WindowSetup, 'product' | 'flags' | 'instance'>): WindowPlan => {
  const { window: config } = product;
  const baseTitle = config.title ?? product.name;
  return {
    headless: flags.isHeadlessLaunch(),
    startup: parseStartupConfig(config.defaultSize),
    saved: loadWindowState(config),
    title: instance.name && !wantsBaselines(flags) ? `${baseTitle} - ${instance.name}` : baseTitle,
  };
};

export { planWindow };
