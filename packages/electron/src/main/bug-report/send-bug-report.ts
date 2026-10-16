/* @layer electron-main @kind logic */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';
import type { BugReportOptions } from './bug-report.type';
import { NO_SERVICE } from './bug-report.constants';
import { settleTransport } from './settle-transport';

const sendBugReport = async (options: BugReportOptions | null, payload: BugReportPayload, ctx: MainContext): Promise<Result<BugReportReceipt>> => {
  if (!options) return { success: false, error: NO_SERVICE };
  return settleTransport(() => options.transport(payload, ctx), ctx);
};

export { sendBugReport };
