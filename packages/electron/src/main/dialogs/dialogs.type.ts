/* @layer electron-main @kind types */
interface ConfirmDialogOptions {
  title: string;
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showOnAutomation?: boolean;
}

interface MainDialogs {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

export type { ConfirmDialogOptions, MainDialogs };
