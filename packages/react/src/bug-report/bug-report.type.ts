/* @layer renderer-shell @kind types */
import type { ProductRepo } from '@drizztdourden08/brock-core';

interface IssueDraft {
  repo: ProductRepo;
  title: string;
  description: string;
  diagnostics: string | null;
}

interface BugReportState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

export type { BugReportState, IssueDraft };
