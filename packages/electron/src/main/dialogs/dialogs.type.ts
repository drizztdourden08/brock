/* @layer electron-main @kind types */
interface ConfirmDialogOptions {
  title: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
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
  choices: DialogChoice[];
  defaultId: string;
  cancelId: string;
  showOnAutomation?: boolean;
}

interface MainDialogs {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  choose: (options: ChooseDialogOptions) => Promise<string>;
}

export type { ChooseDialogOptions, ConfirmDialogOptions, DialogChoice, MainDialogs };
