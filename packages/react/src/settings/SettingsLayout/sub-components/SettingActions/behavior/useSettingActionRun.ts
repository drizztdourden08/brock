/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { SettingAction } from '../../../../settings.type';
import { runSettingAction } from '../../../behavior/run-setting-action';

const useSettingActionRun = () => {
  const [busy, setBusy] = useState<string | null>(null);
  const run = useCallback(async (action: SettingAction, key: string): Promise<void> => {
    try {
      await runSettingAction(action, { onStart: () => setBusy(key) });
    } finally {
      setBusy(null);
    }
  }, []);
  return { busy, run };
};

export { useSettingActionRun };
