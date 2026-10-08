/* @layer renderer-shell @kind types */
import type { BugReportTransport, BugReportTransportInfo, LogEntry, ProductConfig, ProductRepo, SystemDiagnostics } from '@drizztdourden08/brock-core';
import type { BrockAppBugReport } from './bug-report.type';

interface PayloadInput {
  title: string;
  description: string;
  product: Pick<ProductConfig, 'id' | 'name'>;
  version: string;
  diagnostics: string | null;
  system: SystemDiagnostics | null;
  logs: readonly LogEntry[];
  now?: Date;
}

interface TargetSources {
  app: BrockAppBugReport | null;
  main: BugReportTransportInfo | null;
  sendToMain: BugReportTransport | null;
  repo: ProductRepo | undefined;
}

export type { PayloadInput, TargetSources };
