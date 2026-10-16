/* @layer renderer-shell @kind logic */
import type { BugReportExtras } from '@drizztdourden08/brock-core';

const mergeExtras = (app: BugReportExtras | undefined, section: BugReportExtras | null): BugReportExtras | undefined =>
  (section === null ? app : { ...app, ...section });

export { mergeExtras };
