/* @layer renderer-shell @kind logic */
import type { BugReportTarget, BugReportTargetFields } from './bug-report.type';

const fieldsOf = (target: BugReportTarget | null): BugReportTargetFields | null =>
  (target?.kind === 'transport' ? target.fields ?? null : null);

export { fieldsOf };
