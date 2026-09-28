/* @layer renderer-shell @kind types */
interface BugReportForm {
  open: boolean;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  attach: boolean;
  setAttach: (value: boolean) => void;
  diagnostics: string | null;
  hasRepo: boolean;
  canSend: boolean;
  send: () => void;
  close: () => void;
}

export type { BugReportForm };
