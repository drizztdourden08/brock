/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { BugReportAfterSend, BugReportAttachmentLimits, BugReportExtras, BugReportFields, BugReportTransport, ProductRepo } from '@drizztdourden08/brock-core';

interface IssueDraft {
  repo: ProductRepo;
  title: string;
  description: string;
  diagnostics: string | null;
}

interface BugReportSectionProps {
  setExtras: (extras: BugReportExtras | null) => void;
  disabled: boolean;
}

interface BrockAppBugReport extends BugReportFields {
  transport?: BugReportTransport;
  label?: Text;
  identity?: string;
  section?: ComponentType<BugReportSectionProps>;
}

interface BugReportOpenOptions {
  title?: string;
}

type BugReportExtrasSource = () => BugReportExtras | Promise<BugReportExtras>;

interface BugReportTargetFields {
  contact: boolean;
  attachments: BugReportAttachmentLimits | null;
  afterSend: BugReportAfterSend;
  identity: string | null;
}

type BugReportTarget =
  | { kind: 'transport'; label: Text; send: BugReportTransport; fields?: BugReportTargetFields }
  | { kind: 'github'; label: Text; repo: ProductRepo }
  | { kind: 'clipboard'; label: Text };

interface SizedFile {
  name: string;
  size: number;
}

interface AttachmentAdmission<F extends SizedFile> {
  admitted: F[];
  refused: Text | null;
}

interface BugReportState {
  open: boolean;
  prefill: string | null;
  prefillIsDefault: boolean;
  appTransport: BrockAppBugReport | null;
  extras: BugReportExtrasSource | null;
  show: (options?: BugReportOpenOptions) => void;
  hide: () => void;
  setPrefill: (title: string | null) => void;
  setAppTransport: (transport: BrockAppBugReport | null) => void;
  setExtras: (extras: BugReportExtrasSource | null) => void;
}

export type {
  AttachmentAdmission, SizedFile, BrockAppBugReport, BugReportExtrasSource, BugReportOpenOptions, BugReportSectionProps, BugReportState, BugReportTarget,
  BugReportTargetFields, IssueDraft,
};
