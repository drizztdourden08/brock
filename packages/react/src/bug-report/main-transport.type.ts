/* @layer renderer-shell @kind types */
import type { AppIpcApi } from '@drizztdourden08/brock-core';

type ReportApi = Pick<AppIpcApi, 'sendBugReport' | 'retryBugReport'>;

export type { ReportApi };
