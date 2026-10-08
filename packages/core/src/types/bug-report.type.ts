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

interface BugReportPayload {
  title: string;
  description: string;
  app: { id: string; name: string; version: string };
  diagnostics: BugReportDiagnostics | null;
  createdAt: string;
}

interface BugReportReceipt {
  message?: string;
  url?: string;
  id?: string;
}

type BugReportTransport = (payload: BugReportPayload) => Promise<Result<BugReportReceipt>>;

interface BugReportTransportInfo {
  label: string;
}

export type { BugReportDiagnostics, BugReportLogLine, BugReportPayload, BugReportReceipt, BugReportTransport, BugReportTransportInfo };
