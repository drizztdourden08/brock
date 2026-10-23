/* @layer renderer-shell @kind logic */
import type { ConfirmSaveOptions } from '../stores/dialog.type';
import { QUIT_SAVE_CONFIRM } from './quit.constants';
import type { SaveBeforeQuitOptions } from './quit.type';

const saveWording = ({ title, message, saveLabel, discardLabel }: SaveBeforeQuitOptions): ConfirmSaveOptions => ({
  title: title ?? QUIT_SAVE_CONFIRM.title,
  message: message ?? QUIT_SAVE_CONFIRM.message,
  confirmLabel: saveLabel ?? QUIT_SAVE_CONFIRM.confirmLabel,
  discardLabel: discardLabel ?? QUIT_SAVE_CONFIRM.discardLabel,
});

export { saveWording };
