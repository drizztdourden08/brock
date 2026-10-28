/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useScopedStateStore } from '../stores/useScopedStateStore';
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';

const useWidgetStateReady = (scope?: string): boolean => {
  const prefsReady = useWidgetPrefStore((s) => s.hydrated);
  const scopeReady = useScopedStateStore((s) => scope === undefined || s.loaded[scope] === true);

  useEffect(() => {
    if (scope !== undefined) void useScopedStateStore.getState().load(scope);
  }, [scope]);

  return scope === undefined ? prefsReady : scopeReady;
};

export { useWidgetStateReady };
