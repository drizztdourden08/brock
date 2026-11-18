/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { SplashAction } from '@drizztdourden08/tessera/composites';
import { useT } from '../../../i18n';
import { usePlatform } from '../../../platform/usePlatform';

const retry = (): void => window.location.reload();

const useFailureActions = (): readonly SplashAction[] => {
  const t = useT();
  const { storage, window: win, capabilities } = usePlatform();
  const { revealLogs } = storage;
  const quit = capabilities.windowChrome;
  return useMemo(() => [
    { label: t('brock-app:boot.failure.retry'), primary: true, onSelect: retry },
    ...(revealLogs ? [{ label: t('brock-app:boot.failure.openLogs'), onSelect: () => void revealLogs() }] : []),
    ...(quit ? [{ label: t('brock-app:boot.failure.quit'), onSelect: () => win.close({ force: true }) }] : []),
  ], [revealLogs, quit, win, t]);
};

export { useFailureActions };
