/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { BrowserWindow, MessageBoxOptions } from 'electron';
import type { DialogsInput } from './create-dialogs.type';
import type { ConfirmDialogOptions, MainDialogs } from './dialogs.type';
import { CANCEL_BUTTON, CONFIRM_BUTTON, DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL } from './dialogs.constants';

const boxOf = ({ title, message, detail, confirmLabel, cancelLabel }: ConfirmDialogOptions): MessageBoxOptions => ({
  type: 'question',
  title,
  message,
  detail,
  buttons: [confirmLabel ?? DEFAULT_CONFIRM_LABEL, cancelLabel ?? DEFAULT_CANCEL_LABEL],
  defaultId: CONFIRM_BUTTON,
  cancelId: CANCEL_BUTTON,
  noLink: true,
});

const visibleParent = (window: () => BrowserWindow | null): BrowserWindow | null => {
  const win = window();
  if (!win || win.isDestroyed() || !win.isVisible() || win.isMinimized()) return null;
  return win;
};

const createDialogs = ({ flags, window, log }: DialogsInput): MainDialogs => ({
  confirm: async (options) => {
    if (flags.isAutomationLaunch()) {
      log(`confirm dialog "${options.title}" skipped in an automation launch, answered no`);
      return false;
    }
    const parent = visibleParent(window);
    const box = boxOf(options);
    const { response } = parent ? await dialog.showMessageBox(parent, box) : await dialog.showMessageBox(box);
    return response === CONFIRM_BUTTON;
  },
});

export { createDialogs };
