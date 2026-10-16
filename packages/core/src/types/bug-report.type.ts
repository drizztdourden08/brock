/* @layer core @kind types */
import type { Result } from '../result/result.type';
import type { SystemDiagnostics } from './diagnostics.type';

interface BugReportLogLine {
  at: number;
  channel: string;
  level: string;
  message: string;
}

interface BugReportDiagnostics {
  text: string;
  system: SystemDiagnostics | null;
  logs: BugReportLogLine[];
}

interface BugReportAttachment {
  name: string;
  type: string;
  size: number;
  data: Uint8Array;
}

type BugReportExtras = Record<string, unknown>;

interface BugReportPayload {
  title: string;
  description: string;
  app: { id: string; name: string; version: string };
  diagnostics: BugReportDiagnostics | null;
  createdAt: string;
  contact?: string;
  attachments?: BugReportAttachment[];
  extras?: BugReportExtras;
}

interface BugReportAttachmentLimits {
  maxFiles: number;
  maxBytes: number;
}

type BugReportAfterSend = 'toast' | 'view';

interface BugReportFields {
  contact?: boolean;
  attachments?: boolean | Partial<BugReportAttachmentLimits>;
  afterSend?: BugReportAfterSend;
}

interface BugReportLink {
  label: string;
  url: string;
}

interface BugReportReceipt {
  message?: string;
  url?: string;
  id?: string;
  links?: BugReportLink[];
  retry?: () => Promise<Result<BugReportReceipt>>;
}

type BugReportReceiptWire = Omit<BugReportReceipt, 'retry'> & { retryId?: string };

type BugReportTransport = (payload: BugReportPayload) => Promise<Result<BugReportReceipt>>;

interface BugReportTransportInfo extends BugReportFields {
  label: string;
  identity?: string;
}

export type {
  BugReportAfterSend, BugReportAttachment, BugReportAttachmentLimits, BugReportDiagnostics, BugReportExtras, BugReportFields, BugReportLink, BugReportLogLine,
  BugReportPayload, BugReportReceipt, BugReportReceiptWire, BugReportTransport, BugReportTransportInfo,
};
