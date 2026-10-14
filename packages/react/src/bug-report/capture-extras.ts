/* @layer renderer-shell @kind logic */
import type { BugReportExtras } from '@drizztdourden08/brock-core';
import type { BugReportExtrasSource } from './bug-report.type';

const captureExtras = (source: BugReportExtrasSource | null): Promise<BugReportExtras | undefined> =>
  (source ? Promise.resolve().then(source).catch(() => undefined) : Promise.resolve(undefined));

export { captureExtras };
