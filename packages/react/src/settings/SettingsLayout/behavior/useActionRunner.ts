/* @layer renderer-shell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { RunSettingActionOptions, SettingAction } from '../../settings.type';
import type { ActionRunner, BusyActions } from '../SettingsLayout.type';
import { runSettingAction } from './run-setting-action';
import { withoutKey } from './without-key';

const useActionRunner = (): ActionRunner => {
  const [busy, setBusy] = useState<BusyActions>({});
  const run = useCallback(async (key: string, action: SettingAction, options: RunSettingActionOptions = {}): Promise<void> => {
    try {
      await runSettingAction(action, { ...options, onStart: () => setBusy((prev) => ({ ...prev, [key]: true })) });
    } finally {
      setBusy((prev) => withoutKey(prev, key));
    }
  }, []);
  return useMemo(() => ({ busy, run }), [busy, run]);
};

export { useActionRunner };
