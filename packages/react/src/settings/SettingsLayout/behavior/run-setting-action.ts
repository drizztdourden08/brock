/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { controlSources } from '../../../app/control-sources';
import { confirmAction } from '../../../stores/confirm-action';
import type { ConfirmActionOptions } from '../../../stores/dialog.type';
import { toast } from '../../../toast/toast';
import type { RunSettingActionOptions, SettingAction } from '../../settings.type';
import { actionTone } from './action-tone';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const questionOf = (action: SettingAction, inline: boolean): ConfirmActionOptions | null => {
  const { confirm } = action;
  if (confirm === undefined) return null;
  if (typeof confirm !== 'string') return confirm;
  return inline ? null : { title: confirm, message: '', confirmLabel: action.label, variant: actionTone(action) === 'danger' ? 'danger' : 'default' };
};

const runSettingAction = async (action: SettingAction, options: RunSettingActionOptions = {}): Promise<void> => {
  const question = questionOf(action, options.inline === true);
  if (question && !(await confirmAction(question))) return;
  options.onStart?.();
  try {
    await action.onSelect(options.settings ?? {});
  } catch (err) {
    toast(controlSources.get().text(msg('brock-settings:action.failed', { label: action.label, error: messageOf(err) })), { variant: 'danger' });
  }
};

export { runSettingAction };
