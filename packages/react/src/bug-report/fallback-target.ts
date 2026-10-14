/* @layer renderer-shell @kind logic */
import type { ProductRepo } from '@drizztdourden08/brock-core';
import type { BugReportTarget } from './bug-report.type';
import { GITHUB_LABEL } from './bug-report.constants';

const fallbackTarget = (error: string | null, target: BugReportTarget | null, repo: ProductRepo | undefined): BugReportTarget | null =>
  (error !== null && target?.kind === 'transport' && repo ? { kind: 'github', label: GITHUB_LABEL, repo } : null);

export { fallbackTarget };
