/* @layer renderer-shell @kind types */
import type { BugReportTarget } from '../bug-report.type';

interface BugReportForm {
  open: boolean;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  attach: boolean;
  setAttach: (value: boolean) => void;
  diagnostics: string | null;
  target: BugReportTarget | null;
  sending: boolean;
  error: string | null;
  canSend: boolean;
  send: () => void;
  close: () => void;
}

export type { BugReportForm };
