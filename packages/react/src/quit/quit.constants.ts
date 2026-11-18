/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ConfirmActionOptions, ConfirmSaveOptions } from '../stores/dialog.type';

const QUIT_CONFIRM: Omit<ConfirmActionOptions, 'message'> = {
  title: msg('brock-shell:quit.confirm.title'),
  confirmLabel: msg('brock-shell:quit.confirm.confirm'),
  cancelLabel: msg('brock-shell:quit.confirm.cancel'),
  variant: 'danger',
};

const QUIT_SAVE_CONFIRM: Required<Pick<ConfirmSaveOptions, 'title' | 'message' | 'confirmLabel' | 'discardLabel'>> = {
  title: msg('brock-shell:quit.save.title'),
  message: msg('brock-shell:quit.save.message'),
  confirmLabel: msg('brock-shell:quit.save.confirm'),
  discardLabel: msg('brock-shell:quit.save.discard'),
};

const QUIT_SAVE_FAILED = msg('brock-shell:quit.save.failed');

export { QUIT_CONFIRM, QUIT_SAVE_CONFIRM, QUIT_SAVE_FAILED };
