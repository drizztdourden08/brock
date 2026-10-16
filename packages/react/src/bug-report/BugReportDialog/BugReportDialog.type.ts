/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { BugReportAttachment, BugReportAttachmentLimits, BugReportExtras, BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core';
import type { BugReportSectionProps, BugReportTarget, BugReportTargetFields } from '../bug-report.type';

interface AttachmentsModel {
  files: BugReportAttachment[];
  refused: string | null;
  limits: BugReportAttachmentLimits | null;
  add: (files: File[]) => void;
  remove: (index: number) => void;
  reset: () => void;
}

interface ReceiptRetry {
  run: (() => void) | null;
  retrying: boolean;
  error: string | null;
}

interface RetryFailure {
  receipt: BugReportReceipt;
  error: string;
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
  fields: BugReportTargetFields | null;
  contact: string;
  setContact: (value: string) => void;
  attachments: AttachmentsModel;
  section: ComponentType<BugReportSectionProps> | null;
  setSectionExtras: (extras: BugReportExtras | null) => void;
  sending: boolean;
  error: string | null;
  sent: BugReportReceipt | null;
  retry: ReceiptRetry;
  canSend: boolean;
  send: () => void;
  fallback: (() => void) | null;
  close: () => void;
}

interface ReportPayloadModel {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
  attach: boolean;
  setAttach: (value: boolean) => void;
  diagnostics: string | null;
  attachments: AttachmentsModel;
  setSectionExtras: (extras: BugReportExtras | null) => void;
  filled: boolean;
  build: () => Promise<BugReportPayload>;
  reset: () => void;
}

type ReceiptHandler = (receipt: BugReportReceipt) => void;

export type { AttachmentsModel, BugReportForm, ReceiptHandler, ReceiptRetry, ReportPayloadModel, RetryFailure };
