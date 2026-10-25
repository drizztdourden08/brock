/* @layer electron-main @kind types */
interface ConfirmDialogOptions {
  title: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** The button Enter lands on. Escape and closing the box always answer false. Defaults to `confirm`. */
  defaultButton?: 'confirm' | 'cancel';
  showOnAutomation?: boolean;
}

interface DialogChoice {
  id: string;
  label: string;
}

interface ChooseDialogOptions {
  title: string;
  message: string;
  detail?: string;
  /** Two to four choices with unique ids, shown as buttons in this order. */
  choices: DialogChoice[];
  /** The id Enter picks. */
  defaultId: string;
  /** The id that Escape, closing the box and an automation launch answer. */
  cancelId: string;
  showOnAutomation?: boolean;
}

interface MainDialogs {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  choose: (options: ChooseDialogOptions) => Promise<string>;
}

export type { ChooseDialogOptions, ConfirmDialogOptions, DialogChoice, MainDialogs };
