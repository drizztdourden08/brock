/* @layer electron-main @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface ConfirmDialogOptions {
  title: Text;
  message: Text;
  detail?: Text;
  confirmLabel?: Text;
  cancelLabel?: Text;
  defaultButton?: 'confirm' | 'cancel';
  showOnAutomation?: boolean;
}

interface DialogChoice {
  id: string;
  label: Text;
}

interface ChooseDialogOptions {
  title: Text;
  message: Text;
  detail?: Text;
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
