/* @layer renderer-shell @kind logic */
import type { BugReportPayload, BugReportTransport } from '@drizztdourden08/brock-core';
import { openExternal } from '../../../host/open-external';
import { writeClipboard } from '../../../host/write-clipboard';
import { toast } from '../../../toast/toast';
import { buildIssueBody } from '../../build-issue-body';
import { buildIssueUrl } from '../../build-issue-url';
import type { BugReportTarget } from '../../bug-report.type';
import type { ReceiptHandler } from '../BugReportDialog.type';
import { COPIED_MESSAGE, COPY_FAILED_MESSAGE, OPENED_MESSAGE } from '../BugReportDialog.constants';
import { announceReceipt } from './announce-receipt';
import { settleTransport } from './settle-transport';

const sendThrough = async (send: BugReportTransport, payload: BugReportPayload, onReceipt: ReceiptHandler): Promise<string | null> => {
  const result = await settleTransport(() => send(payload));
  if (!result.success) return result.error;
  onReceipt(result.value);
  return null;
};

const deliverReport = async (target: BugReportTarget, payload: BugReportPayload, onReceipt: ReceiptHandler = announceReceipt): Promise<string | null> => {
  const diagnostics = payload.diagnostics?.text ?? null;
  if (target.kind === 'transport') return sendThrough(target.send, payload, onReceipt);
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
