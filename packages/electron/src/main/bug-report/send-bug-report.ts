/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';
import type { BugReportOptions } from './bug-report.type';

const sendBugReport = async (options: BugReportOptions | null, payload: BugReportPayload, ctx: MainContext): Promise<Result<BugReportReceipt>> => {
  if (!options) return { success: false, error: 'This app has no report service.' };
  try {
    const result = await options.transport(payload, ctx);
    if (!result.success) ctx.log(`bug report not sent: ${result.error}`, 'warn');
    return result;
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    ctx.log(`bug report transport threw: ${error}`, 'error');
    return { success: false, error };
  }
};

export { sendBugReport };
