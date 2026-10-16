/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportReceipt, BugReportReceiptWire } from '@drizztdourden08/brock-core/types';
import { heldRetry } from './held-retry';

const receiptWire = (result: Result<BugReportReceipt>): Result<BugReportReceiptWire> => {
  if (!result.success) return result;
  const { retry, ...receipt } = result.value;
  if (!retry) {
    heldRetry.current = null;
    return { success: true, value: receipt };
  }
  heldRetry.next += 1;
  const retryId = String(heldRetry.next);
  heldRetry.current = { id: retryId, run: retry };
  return { success: true, value: { ...receipt, retryId } };
};

export { receiptWire };
