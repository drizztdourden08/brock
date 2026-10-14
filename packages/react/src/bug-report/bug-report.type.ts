/* @layer renderer-shell @kind types */
import type { BugReportAfterSend, BugReportAttachmentLimits, BugReportExtras, BugReportFields, BugReportTransport, ProductRepo } from '@drizztdourden08/brock-core';

interface IssueDraft {
  repo: ProductRepo;
  title: string;
  description: string;
  diagnostics: string | null;
}

interface BrockAppBugReport extends BugReportFields {
  transport: BugReportTransport;
  label?: string;
}

type BugReportExtrasSource = () => BugReportExtras | Promise<BugReportExtras>;

interface BugReportTargetFields {
  contact: boolean;
  attachments: BugReportAttachmentLimits | null;
  afterSend: BugReportAfterSend;
}

type BugReportTarget =
  | { kind: 'transport'; label: string; send: BugReportTransport; fields?: BugReportTargetFields }
  | { kind: 'github'; label: string; repo: ProductRepo }
  | { kind: 'clipboard'; label: string };

interface SizedFile {
  name: string;
  size: number;
}

interface AttachmentAdmission<F extends SizedFile> {
  admitted: F[];
  refused: string | null;
}

interface BugReportState {
  open: boolean;
  appTransport: BrockAppBugReport | null;
  extras: BugReportExtrasSource | null;
  show: () => void;
  hide: () => void;
  setAppTransport: (transport: BrockAppBugReport | null) => void;
  setExtras: (extras: BugReportExtrasSource | null) => void;
}

export type { AttachmentAdmission, SizedFile, BrockAppBugReport, BugReportExtrasSource, BugReportState, BugReportTarget, BugReportTargetFields, IssueDraft };
