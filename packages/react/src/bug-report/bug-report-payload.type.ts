/* @layer renderer-shell @kind types */
import type { BugReportAttachment, BugReportReceipt, BugReportTransport, BugReportTransportInfo, LogEntry, ProductConfig, ProductRepo, SystemDiagnostics } from '@drizztdourden08/brock-core';
import type { BrockAppBugReport } from './bug-report.type';

interface PayloadInput {
  title: string;
  description: string;
  product: Pick<ProductConfig, 'id' | 'name'>;
  version: string;
  diagnostics: string | null;
  system: SystemDiagnostics | null;
  logs: readonly LogEntry[];
  contact?: string;
  attachments?: readonly BugReportAttachment[];
  now?: Date;
}

interface AttachmentRead {
  added: BugReportAttachment[];
  refused: string[];
}

type DeliveryResult = { sent: true; receipt: BugReportReceipt } | { sent: false; error: string };

interface TargetSources {
  app: BrockAppBugReport | null;
  main: BugReportTransportInfo | null;
  sendToMain: BugReportTransport | null;
  repo: ProductRepo | undefined;
}

export type { AttachmentRead, DeliveryResult, PayloadInput, TargetSources };
