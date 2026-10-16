/* @layer renderer-shell @kind logic */
import type { BugReportReceipt, Result } from '@drizztdourden08/brock-core';

const settleTransport = (run: () => Promise<Result<BugReportReceipt>>): Promise<Result<BugReportReceipt>> =>
  Promise.resolve().then(run).catch((err: unknown) => ({ success: false as const, error: err instanceof Error ? err.message : String(err) }));

export { settleTransport };
