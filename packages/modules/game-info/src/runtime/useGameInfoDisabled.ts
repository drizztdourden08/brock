/* @layer renderer-shell @kind hook */
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import { useSyncExternalStore } from 'react';
import { useProviderStore } from '../provider/useProviderStore';

const noSubscribe = (): (() => void) => () => undefined;

const useGameInfoDisabled = (): WidgetDisabledState | null => {
  const gate = useProviderStore((s) => s.provider?.gate ?? null);
  return useSyncExternalStore(gate ? gate.subscribe : noSubscribe, () => (gate ? gate.get() : null));
};

export { useGameInfoDisabled };
