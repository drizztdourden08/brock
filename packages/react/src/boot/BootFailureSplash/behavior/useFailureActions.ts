/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { SplashAction } from '@drizztdourden08/tessera/composites';
import { usePlatform } from '../../../platform/usePlatform';

const retry = (): void => window.location.reload();

const useFailureActions = (): readonly SplashAction[] => {
  const { storage, window: win, capabilities } = usePlatform();
  const { revealLogs } = storage;
  const quit = capabilities.windowChrome;
  return useMemo(() => [
    { label: 'Retry', primary: true, onSelect: retry },
    ...(revealLogs ? [{ label: 'Open logs', onSelect: () => void revealLogs() }] : []),
    ...(quit ? [{ label: 'Quit', onSelect: () => win.close() }] : []),
  ], [revealLogs, quit, win]);
};

export { useFailureActions };
