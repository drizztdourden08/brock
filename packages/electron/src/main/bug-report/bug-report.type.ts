/* @layer electron-main @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportFields, BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';

type MainBugReportTransport = (payload: BugReportPayload, ctx: MainContext) => Promise<Result<BugReportReceipt>>;

interface BugReportOptions extends BugReportFields {
  transport: MainBugReportTransport;
  label?: string;
  available?: (ctx: MainContext) => boolean | Promise<boolean>;
  identity?: (ctx: MainContext) => string | null | undefined | Promise<string | null | undefined>;
}

interface HeldRetry {
  id: string;
  run: NonNullable<BugReportReceipt['retry']>;
}

interface DebugFile {
  name: string;
  path: string;
}

interface DebugZipEntry {
  name: string;
  data: Buffer | string;
}

export type { BugReportOptions, DebugFile, DebugZipEntry, HeldRetry, MainBugReportTransport };
