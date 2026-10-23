/* @layer renderer-shell @kind constants */
import type { ConfirmActionOptions, ConfirmSaveOptions } from '../stores/dialog.type';

const QUIT_CONFIRM: Omit<ConfirmActionOptions, 'message'> = {
  title: 'Quit anyway?',
  confirmLabel: 'Quit',
  cancelLabel: 'Stay',
  variant: 'danger',
};

const QUIT_SAVE_CONFIRM: Required<Pick<ConfirmSaveOptions, 'title' | 'message' | 'confirmLabel' | 'discardLabel'>> = {
  title: 'Save changes?',
  message: 'Your changes will be lost if you do not save them.',
  confirmLabel: 'Save',
  discardLabel: 'Discard',
};

const QUIT_SAVE_FAILED = 'Could not save. The app stays open.';

export { QUIT_CONFIRM, QUIT_SAVE_CONFIRM, QUIT_SAVE_FAILED };
