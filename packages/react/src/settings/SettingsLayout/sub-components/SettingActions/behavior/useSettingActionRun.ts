/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { SettingAction, SettingValues } from '../../../../settings.type';
import { runSettingAction } from '../../../behavior/run-setting-action';

const useSettingActionRun = (settings?: SettingValues) => {
  const [busy, setBusy] = useState<string | null>(null);
  const run = useCallback(async (action: SettingAction, key: string): Promise<void> => {
    try {
      await runSettingAction(action, { settings, onStart: () => setBusy(key) });
    } finally {
      setBusy(null);
    }
  }, [settings]);
  return { busy, run };
};

export { useSettingActionRun };
