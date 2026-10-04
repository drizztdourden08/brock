/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { confirmAction } from '../../../../../stores/confirm-action';
import { toast } from '../../../../../toast/toast';
import type { SettingAction } from '../../../../settings.type';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const useSettingActionRun = () => {
  const [busy, setBusy] = useState<string | null>(null);
  const run = useCallback(async (action: SettingAction, key: string): Promise<void> => {
    if (action.confirm && !(await confirmAction(action.confirm))) return;
    setBusy(key);
    try {
      await action.onSelect();
    } catch (err) {
      toast(`${action.label} failed: ${messageOf(err)}`, { variant: 'danger' });
    } finally {
      setBusy(null);
    }
  }, []);
  return { busy, run };
};

export { useSettingActionRun };
