/* @layer renderer-shell @kind logic */
import { lazyLoads } from '../lazy/lazy-loads';
import { getAppLog } from '../log/get-app-log';
import { selectButton } from './select-button';
import type { TitleBarButtonLook, TitleBarItemSource } from './title-bar-item.type';

const report = (label: string) => (error: unknown): void => {
  getAppLog().log('app', `Title bar item "${label}" could not load: ${error instanceof Error ? error.message : String(error)}`, 'error');
};

const lazyTitleBarButton = (look: TitleBarButtonLook, load: () => Promise<{ default: TitleBarItemSource }>): TitleBarButtonLook & { onSelect: () => void } => ({
  ...look,
  onSelect: () => {
    lazyLoads.track(load()).then(({ default: source }) => {
      if (typeof source !== 'function' && source.kind === 'button') selectButton(source);
    }, report(look.label));
  },
});

export { lazyTitleBarButton };
