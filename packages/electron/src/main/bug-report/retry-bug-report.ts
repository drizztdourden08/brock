/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportReceiptWire } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';
import { RETRY_GONE } from './bug-report.constants';
import { heldRetry } from './held-retry';
import { receiptWire } from './receipt-wire';
import { settleTransport } from './settle-transport';

const retryBugReport = async (retryId: string, ctx: MainContext): Promise<Result<BugReportReceiptWire>> => {
  const held = heldRetry.current;
  if (held?.id !== retryId) return { success: false, error: RETRY_GONE };
  return receiptWire(await settleTransport(held.run, ctx));
};

export { retryBugReport };
