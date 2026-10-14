/* @layer renderer-shell @kind types */
import type { BugReportTransport, ProductRepo } from '@drizztdourden08/brock-core';

interface IssueDraft {
  repo: ProductRepo;
  title: string;
  description: string;
  diagnostics: string | null;
}

interface BugReportContactOptions {
  required?: boolean;
  label?: string;
  hint?: string;
}

interface BugReportAttachmentOptions {
  accept?: readonly string[];
  maxFiles?: number;
  maxBytes?: number;
}

type BugReportAfterSend = 'toast' | 'view';

interface BrockAppBugReport {
  transport?: BugReportTransport;
  label?: string;
  contact?: boolean | BugReportContactOptions;
  attachments?: boolean | BugReportAttachmentOptions;
  afterSend?: BugReportAfterSend;
}

interface BugReportContactField {
  required: boolean;
  label: string;
  hint: string;
}

interface BugReportAttachmentField {
  accept: readonly string[];
  maxFiles: number;
  maxBytes: number;
}

interface BugReportFields {
  contact: BugReportContactField | null;
  attachments: BugReportAttachmentField | null;
  afterSend: BugReportAfterSend;
}

type BugReportTarget =
  | { kind: 'transport'; label: string; send: BugReportTransport }
  | { kind: 'github'; label: string; repo: ProductRepo }
  | { kind: 'clipboard'; label: string };

interface BugReportState {
  open: boolean;
  appTransport: BrockAppBugReport | null;
  show: () => void;
  hide: () => void;
  setAppTransport: (transport: BrockAppBugReport | null) => void;
}

export type {
  BrockAppBugReport, BugReportAfterSend, BugReportAttachmentField, BugReportAttachmentOptions, BugReportContactField, BugReportContactOptions, BugReportFields, BugReportState, BugReportTarget, IssueDraft,
};
