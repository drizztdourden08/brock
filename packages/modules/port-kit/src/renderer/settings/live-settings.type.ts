/* @layer renderer-shell @kind types */
import type { CoreCalls } from '../../port/port-definition.type';
import type { GameCore } from '../core/game-core.type';

interface LiveSettings<S> {
  push: (settings: S) => boolean;
  reassert: () => boolean;
  last: () => S | null;
}

interface LiveSettingsCalls<S> {
  calls: () => CoreCalls | null;
  apply: (settings: S, calls: CoreCalls) => void;
}

type LiveSettingsTarget<S> = Pick<GameCore<S>, 'calls' | 'definition'> | LiveSettingsCalls<S>;

export type { LiveSettings, LiveSettingsCalls, LiveSettingsTarget };
