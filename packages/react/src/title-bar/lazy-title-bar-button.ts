/* @layer renderer-shell @kind logic */
import { lazyLoads } from '../lazy/lazy-loads';
import { getAppLog } from '../log/get-app-log';
import type { TitleBarButtonLook, TitleBarButtonSpec, TitleBarItemSource } from './title-bar-item.type';

const report = (label: string) => (error: unknown): void => {
  getAppLog().log('app', `Title bar item "${label}" could not load: ${error instanceof Error ? error.message : String(error)}`, 'error');
};

const lazyTitleBarButton = (look: TitleBarButtonLook, load: () => Promise<{ default: TitleBarItemSource }>): TitleBarButtonSpec => ({
  ...look,
  onSelect: () => {
    lazyLoads.track(load()).then(({ default: source }) => {
      if (typeof source !== 'function' && source.kind === 'button') source.onSelect();
    }, report(look.label));
  },
});

export { lazyTitleBarButton };
