/* @layer electron-main @kind types */
import type { Result } from '@drizztdourden08/brock-core/result';
import type { BugReportPayload, BugReportReceipt } from '@drizztdourden08/brock-core/types';
import type { MainContext } from '../types/main-context.type';

type MainBugReportTransport = (payload: BugReportPayload, ctx: MainContext) => Promise<Result<BugReportReceipt>>;

interface BugReportOptions {
  transport: MainBugReportTransport;
  label?: string;
}

interface DebugFile {
  name: string;
  path: string;
}

interface DebugZipEntry {
  name: string;
  data: Buffer | string;
}

export type { BugReportOptions, DebugFile, DebugZipEntry, MainBugReportTransport };
