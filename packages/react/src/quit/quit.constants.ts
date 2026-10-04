/* @layer renderer-shell @kind constants */
import type { ConfirmActionOptions } from '../stores/dialog.type';

const QUIT_CONFIRM: Omit<ConfirmActionOptions, 'message'> = {
  title: 'Quit anyway?',
  confirmLabel: 'Quit',
  cancelLabel: 'Stay',
  variant: 'danger',
};

export { QUIT_CONFIRM };
