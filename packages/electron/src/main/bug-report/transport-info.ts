/* @layer electron-main @kind logic */
import type { BugReportTransportInfo } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';
import type { BugReportOptions } from './bug-report.type';
import { DEFAULT_SEND_LABEL } from './bug-report.constants';

const isAvailable = async (options: BugReportOptions, ctx: MainContext): Promise<boolean> => {
  if (!options.available) return true;
  try {
    return await options.available(ctx);
  } catch (err) {
    ctx.log(`bug report availability check threw: ${err instanceof Error ? err.message : String(err)}`, 'warn');
    return false;
  }
};

const transportInfo = async (options: BugReportOptions | null, ctx: MainContext): Promise<BugReportTransportInfo | null> => {
  if (!options || !(await isAvailable(options, ctx))) return null;
  const { label = DEFAULT_SEND_LABEL, contact, attachments, afterSend } = options;
  return {
    label,
    ...(contact === undefined ? {} : { contact }),
    ...(attachments === undefined ? {} : { attachments }),
    ...(afterSend === undefined ? {} : { afterSend }),
  };
};

export { transportInfo };
