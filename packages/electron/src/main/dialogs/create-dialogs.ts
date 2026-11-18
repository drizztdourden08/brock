/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { BrowserWindow } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BoxSpec, DialogsInput } from './create-dialogs.type';
import type { MainDialogs } from './dialogs.type';
import { checkChoices } from './check-choices';
import { dialogText, optionalDialogText } from './dialog-text';
import { CANCEL_BUTTON, CONFIRM_BUTTON, DEFAULT_CANCEL_KEY, DEFAULT_CONFIRM_KEY, NON_BLOCKING_FLAGS } from './dialogs.constants';

const visibleParent = (window: () => BrowserWindow | null): BrowserWindow | null => {
  const win = window();
  if (!win || win.isDestroyed() || !win.isVisible() || win.isMinimized()) return null;
  return win;
};

const endsItself = (flags: AutomationFlags): boolean => NON_BLOCKING_FLAGS.some((flag) => flags.hasFlag(flag));

const ask = async ({ flags, window, log }: DialogsInput, spec: BoxSpec): Promise<number> => {
  const { kind, title, message, detail, buttons, defaultId, cancelId, showOnAutomation } = spec;
  if (flags.isAutomationLaunch() && !(showOnAutomation === true && !endsItself(flags))) {
    log(`${kind} dialog "${title}" skipped in an automation launch, answered cancel`);
    return cancelId;
  }
  const parent = visibleParent(window);
  const box = { type: 'question' as const, title, message, detail, buttons, defaultId, cancelId, noLink: true };
  const { response } = parent ? await dialog.showMessageBox(parent, box) : await dialog.showMessageBox(box);
  return response;
};

const createDialogs = (input: DialogsInput): MainDialogs => ({
  confirm: async (options) => {
    const { title, message, detail, confirmLabel, cancelLabel, defaultButton, showOnAutomation } = options;
    const response = await ask(input, {
      kind: 'confirm',
      title: dialogText(title),
      message: dialogText(message),
      detail: optionalDialogText(detail),
      buttons: [dialogText(confirmLabel ?? DEFAULT_CONFIRM_KEY), dialogText(cancelLabel ?? DEFAULT_CANCEL_KEY)],
      defaultId: defaultButton === 'cancel' ? CANCEL_BUTTON : CONFIRM_BUTTON,
      cancelId: CANCEL_BUTTON,
      showOnAutomation,
    });
    return response === CONFIRM_BUTTON;
  },
  choose: async (options) => {
    checkChoices(options);
    const { title, message, detail, choices, defaultId, cancelId, showOnAutomation } = options;
    const ids = choices.map((choice) => choice.id);
    const response = await ask(input, {
      kind: 'choose',
      title: dialogText(title),
      message: dialogText(message),
      detail: optionalDialogText(detail),
      buttons: choices.map((choice) => dialogText(choice.label)),
      defaultId: ids.indexOf(defaultId),
      cancelId: ids.indexOf(cancelId),
      showOnAutomation,
    });
    return ids[response] ?? cancelId;
  },
});

export { createDialogs };
