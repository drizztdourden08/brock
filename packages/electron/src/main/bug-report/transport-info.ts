/* @layer electron-main @kind logic */
import type { BugReportTransportInfo } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';
import type { BugReportOptions } from './bug-report.type';
import { DEFAULT_SEND_LABEL } from './bug-report.constants';

const ask = async <T>(question: ((ctx: MainContext) => T | Promise<T>) | undefined, ctx: MainContext, what: string): Promise<T | undefined> => {
  if (!question) return undefined;
  try {
    return await question(ctx);
  } catch (err) {
    ctx.log(`bug report ${what} threw: ${err instanceof Error ? err.message : String(err)}`, 'warn');
    return undefined;
  }
};

const isAvailable = async (options: BugReportOptions, ctx: MainContext): Promise<boolean> => {
  if (!options.available) return true;
  return (await ask(options.available, ctx, 'availability check')) === true;
};

const transportInfo = async (options: BugReportOptions | null, ctx: MainContext): Promise<BugReportTransportInfo | null> => {
  if (!options || !(await isAvailable(options, ctx))) return null;
  const { label = DEFAULT_SEND_LABEL, contact, attachments, afterSend } = options;
  const identity = (await ask(options.identity, ctx, 'identity'))?.trim();
  return {
    label,
    ...(contact === undefined ? {} : { contact }),
    ...(attachments === undefined ? {} : { attachments }),
    ...(afterSend === undefined ? {} : { afterSend }),
    ...(identity ? { identity } : {}),
  };
};

export { transportInfo };
