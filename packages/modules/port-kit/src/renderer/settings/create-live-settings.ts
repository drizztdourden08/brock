/* @layer renderer-shell @kind logic */
import type { GameCore } from '../core/game-core.type';
import type { LiveSettings } from './live-settings.type';

const createLiveSettings = <S>(core: GameCore<S>): LiveSettings<S> => {
  let latest: S | null = null;

  const apply = (settings: S): boolean => {
    const calls = core.calls();
    const definition = core.definition.settings;
    if (!calls || !definition) return false;
    definition.apply(settings, calls);
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
