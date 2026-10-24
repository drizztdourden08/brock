/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { BrowserWindow, MessageBoxOptions } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { DialogsInput } from './create-dialogs.type';
import type { ConfirmDialogOptions, MainDialogs } from './dialogs.type';
import { CANCEL_BUTTON, CONFIRM_BUTTON, DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL, NON_BLOCKING_FLAGS } from './dialogs.constants';

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

const endsItself = (flags: AutomationFlags): boolean => NON_BLOCKING_FLAGS.some((flag) => flags.hasFlag(flag));

const createDialogs = ({ flags, window, log }: DialogsInput): MainDialogs => ({
  confirm: async (options) => {
    if (flags.isAutomationLaunch() && !(options.showOnAutomation === true && !endsItself(flags))) {
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
