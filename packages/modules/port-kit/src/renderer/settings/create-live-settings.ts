/* @layer renderer-shell @kind logic */
import type { CoreCalls } from '../../port/port-definition.type';
import type { LiveSettings, LiveSettingsTarget } from './live-settings.type';

const applierOf = <S>(target: LiveSettingsTarget<S>): ((settings: S, calls: CoreCalls) => void) | null =>
  ('apply' in target ? target.apply : target.definition.settings?.apply) ?? null;

const createLiveSettings = <S>(target: LiveSettingsTarget<S>): LiveSettings<S> => {
  let latest: S | null = null;

  const apply = (settings: S): boolean => {
    const calls = target.calls();
    const applier = applierOf(target);
    if (!calls || !applier) return false;
    applier(settings, calls);
    return true;
  };

  const push = (settings: S): boolean => {
    latest = settings;
    return apply(settings);
  };

  const reassert = (): boolean => (latest === null ? false : apply(latest));

  return { push, reassert, last: () => latest };
};

export { createLiveSettings };
