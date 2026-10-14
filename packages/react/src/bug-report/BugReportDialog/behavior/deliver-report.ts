/* @layer renderer-shell @kind logic */
import type { BugReportPayload, BugReportTransport } from '@drizztdourden08/brock-core';
import { openExternal } from '../../../host/open-external';
import { writeClipboard } from '../../../host/write-clipboard';
import { buildIssueBody } from '../../build-issue-body';
import { buildIssueUrl } from '../../build-issue-url';
import type { DeliveryResult } from '../../bug-report-payload.type';
import type { BugReportTarget } from '../../bug-report.type';
import { COPIED_MESSAGE, COPY_FAILED_MESSAGE, OPENED_MESSAGE, SENT_MESSAGE } from '../BugReportDialog.constants';

const sendThrough = async (send: BugReportTransport, payload: BugReportPayload): Promise<DeliveryResult> => {
  const result = await send(payload).catch((err: unknown) => ({ success: false as const, error: err instanceof Error ? err.message : String(err) }));
  if (!result.success) return { sent: false, error: result.error };
  return { sent: true, receipt: { ...result.value, message: result.value.message ?? SENT_MESSAGE } };
};

const deliverReport = async (target: BugReportTarget, payload: BugReportPayload): Promise<DeliveryResult> => {
  const diagnostics = payload.diagnostics?.text ?? null;
  if (target.kind === 'transport') return sendThrough(target.send, payload);
  if (target.kind === 'github') {
    openExternal(buildIssueUrl({ repo: target.repo, title: payload.title, description: payload.description, diagnostics }));
    return { sent: true, receipt: { message: OPENED_MESSAGE } };
  }
  const copied = await writeClipboard(`${payload.title}

${buildIssueBody(payload.description, diagnostics)}`);
  return copied ? { sent: true, receipt: { message: COPIED_MESSAGE } } : { sent: false, error: COPY_FAILED_MESSAGE };
};

export { deliverReport };
