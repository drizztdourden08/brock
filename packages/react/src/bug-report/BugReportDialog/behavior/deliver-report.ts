/* @layer renderer-shell @kind logic */
import type { BugReportPayload, BugReportTransport } from '@drizztdourden08/brock-core';
import { openExternal } from '../../../host/open-external';
import { writeClipboard } from '../../../host/write-clipboard';
import { toast } from '../../../toast/toast';
import { buildIssueBody } from '../../build-issue-body';
import { buildIssueUrl } from '../../build-issue-url';
import type { BugReportTarget } from '../../bug-report.type';
import { COPIED_MESSAGE, COPY_FAILED_MESSAGE, OPEN_RECEIPT_LABEL, OPENED_MESSAGE, SENT_MESSAGE } from '../BugReportDialog.constants';

const sendThrough = async (send: BugReportTransport, payload: BugReportPayload): Promise<string | null> => {
  const result = await send(payload).catch((err: unknown) => ({ success: false as const, error: err instanceof Error ? err.message : String(err) }));
  if (!result.success) return result.error;
  const { message, url } = result.value;
  toast(message ?? SENT_MESSAGE, { variant: 'success', ...(url ? { action: { label: OPEN_RECEIPT_LABEL, onSelect: () => openExternal(url) } } : {}) });
  return null;
};

const deliverReport = async (target: BugReportTarget, payload: BugReportPayload): Promise<string | null> => {
  const diagnostics = payload.diagnostics?.text ?? null;
  if (target.kind === 'transport') return sendThrough(target.send, payload);
  if (target.kind === 'github') {
    openExternal(buildIssueUrl({ repo: target.repo, title: payload.title, description: payload.description, diagnostics }));
    toast(OPENED_MESSAGE, { variant: 'success' });
    return null;
  }
  const copied = await writeClipboard(`${payload.title}\n\n${buildIssueBody(payload.description, diagnostics)}`);
  toast(copied ? COPIED_MESSAGE : COPY_FAILED_MESSAGE, { variant: copied ? 'success' : 'danger' });
  return null;
};

export { deliverReport };
