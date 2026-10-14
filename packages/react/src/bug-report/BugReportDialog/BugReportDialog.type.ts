/* @layer renderer-shell @kind types */
import type { BugReportAttachment, BugReportAttachmentLimits, BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core';
import type { BugReportTarget, BugReportTargetFields } from '../bug-report.type';

interface AttachmentsModel {
  files: BugReportAttachment[];
  refused: string | null;
  limits: BugReportAttachmentLimits | null;
  add: (files: File[]) => void;
  remove: (index: number) => void;
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
  fields: BugReportTargetFields | null;
  contact: string;
  setContact: (value: string) => void;
  attachments: AttachmentsModel;
  sending: boolean;
  error: string | null;
  sent: BugReportReceipt | null;
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
  filled: boolean;
  build: () => Promise<BugReportPayload>;
  reset: () => void;
}

type ReceiptHandler = (receipt: BugReportReceipt) => void;

export type { AttachmentsModel, BugReportForm, ReceiptHandler, ReportPayloadModel };
