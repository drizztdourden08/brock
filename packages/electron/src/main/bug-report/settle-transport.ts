/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportReceipt } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';

const settleTransport = async (run: () => Promise<Result<BugReportReceipt>>, ctx: MainContext): Promise<Result<BugReportReceipt>> => {
  try {
    const result = await run();
    if (!result.success) ctx.log(`bug report not sent: ${result.error}`, 'warn');
    return result;
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    ctx.log(`bug report transport threw: ${error}`, 'error');
    return { success: false, error };
  }
};

export { settleTransport };
