/* @layer electron-main @kind logic */
import { dialog } from 'electron';
import type { BrowserWindow } from 'electron';
import type { AutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BoxSpec, DialogsInput } from './create-dialogs.type';
import type { MainDialogs } from './dialogs.type';
import { checkChoices } from './check-choices';
import { CANCEL_BUTTON, CONFIRM_BUTTON, DEFAULT_CANCEL_LABEL, DEFAULT_CONFIRM_LABEL, NON_BLOCKING_FLAGS } from './dialogs.constants';

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
      title,
      message,
      detail,
      buttons: [confirmLabel ?? DEFAULT_CONFIRM_LABEL, cancelLabel ?? DEFAULT_CANCEL_LABEL],
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
      title,
      message,
      detail,
      buttons: choices.map((choice) => choice.label),
      defaultId: ids.indexOf(defaultId),
      cancelId: ids.indexOf(cancelId),
      showOnAutomation,
    });
    return ids[response] ?? cancelId;
  },
});

export { createDialogs };
