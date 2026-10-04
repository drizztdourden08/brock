/* @layer renderer-shell @kind logic */
import { confirmAction } from '../../../stores/confirm-action';
import type { ConfirmActionOptions } from '../../../stores/dialog.type';
import { toast } from '../../../toast/toast';
import type { RunSettingActionOptions, SettingAction } from '../../settings.type';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const questionOf = (action: SettingAction, inline: boolean): ConfirmActionOptions | null => {
  const { confirm } = action;
  if (confirm === undefined) return null;
  if (typeof confirm !== 'string') return confirm;
  return inline ? null : { title: confirm, message: '', confirmLabel: action.label, variant: action.variant === 'danger' ? 'danger' : 'default' };
};

const runSettingAction = async (action: SettingAction, options: RunSettingActionOptions = {}): Promise<void> => {
  const question = questionOf(action, options.inline === true);
  if (question && !(await confirmAction(question))) return;
  options.onStart?.();
  try {
    await action.onSelect(options.settings ?? {});
  } catch (err) {
    toast(`${action.label} failed: ${messageOf(err)}`, { variant: 'danger' });
  }
};

export { runSettingAction };
