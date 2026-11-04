/* @layer renderer-shell @kind logic */
import type { SettingLockCause } from '../settings.type';
import type { LockCauseProvider } from './lock-cause-provider.type';

const composeLockCauses = <S extends object>(providers: readonly LockCauseProvider<S>[]): ((key: string, settings: S) => SettingLockCause | null) | undefined => {
  if (providers.length === 0) return undefined;
  const sorted = [...providers].sort((a, b) => a.order - b.order);
  return (key, settings) => {
    for (const provider of sorted) {
      const cause = provider.causeOf(key, settings);
      if (cause !== null) return cause;
    }
    return null;
  };
};

export { composeLockCauses };
