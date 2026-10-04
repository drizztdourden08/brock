/* @layer renderer-shell @kind types */
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';

interface JobStoreState {
  jobs: Record<string, JobSnapshot>;
  shown: string | null;
  upsert: (job: JobSnapshot) => void;
  remove: (id: string) => void;
  show: (id: string | null) => void;
}

interface UseJobResult {
  job: JobSnapshot | null;
  shown: boolean;
  open: () => void;
  hide: () => void;
  cancel: () => void;
  dismiss: () => void;
}

export type { JobStoreState, UseJobResult };
