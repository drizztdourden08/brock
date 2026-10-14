/* @layer renderer-shell @kind types */
import type { BugReportAttachment, BugReportReceipt } from '@drizztdourden08/brock-core';
import type { BugReportFields, BugReportTarget } from '../bug-report.type';

interface BugReportExtras {
  fields: BugReportFields;
  contact: string;
  setContact: (value: string) => void;
  contactError: string | null;
  attachments: readonly BugReportAttachment[];
  addFiles: (files: File[]) => void;
  removeAttachment: (index: number) => void;
  refused: readonly string[];
  valid: boolean;
  reset: () => void;
}

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
  extras: BugReportExtras;
  sending: boolean;
  error: string | null;
  sent: BugReportReceipt | null;
  canSend: boolean;
  send: () => void;
  close: () => void;
}

export type { BugReportExtras, BugReportForm };
