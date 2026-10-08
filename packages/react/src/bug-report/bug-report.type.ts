/* @layer renderer-shell @kind types */
import type { BugReportTransport, ProductRepo } from '@drizztdourden08/brock-core';

interface IssueDraft {
  repo: ProductRepo;
  title: string;
  description: string;
  diagnostics: string | null;
}

interface BrockAppBugReport {
  transport: BugReportTransport;
  label?: string;
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

export type { BrockAppBugReport, BugReportState, BugReportTarget, IssueDraft };
