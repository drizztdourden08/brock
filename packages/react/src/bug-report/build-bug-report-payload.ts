/* @layer renderer-shell @kind logic */
import { redactSecrets } from '@drizztdourden08/brock-core';
import type { BugReportPayload, LogEntry, SystemDiagnostics } from '@drizztdourden08/brock-core';
import type { PayloadInput } from './bug-report-payload.type';
import { BUG_REPORT_LOG_TAIL } from './bug-report.constants';

const logLines = (entries: readonly LogEntry[]) =>
  entries.slice(-BUG_REPORT_LOG_TAIL).map((entry) => ({ at: entry.timestamp, channel: entry.channel, level: entry.level, message: redactSecrets(entry.message) }));

const diagnosticsOf = (text: string | null, system: SystemDiagnostics | null, logs: readonly LogEntry[]): BugReportPayload['diagnostics'] =>
  (text === null ? null : { text, system, logs: logLines(logs) });

const optionalParts = ({ contact, attachments, extras }: PayloadInput): Partial<BugReportPayload> => ({
  ...(contact?.trim() ? { contact: contact.trim() } : {}),
  ...(attachments && attachments.length > 0 ? { attachments: [...attachments] } : {}),
  ...(extras ? { extras } : {}),
});

const buildBugReportPayload = (input: PayloadInput): BugReportPayload => ({
  title: input.title.trim(),
  description: input.description.trim(),
  app: { id: input.product.id, name: input.product.name, version: input.version },
  diagnostics: diagnosticsOf(input.diagnostics, input.system, input.logs),
  createdAt: (input.now ?? new Date()).toISOString(),
  ...optionalParts(input),
});

export { buildBugReportPayload };
