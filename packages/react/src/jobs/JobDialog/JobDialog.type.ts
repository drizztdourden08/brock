/* @layer renderer-shell @kind types */
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';

interface JobDialogProps {
  job: JobSnapshot;
  onHide: () => void;
  onCancel: () => void;
  onClose: () => void;
}

interface JobDialogActionsProps {
  job: JobSnapshot;
  onHide: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export type { JobDialogActionsProps, JobDialogProps };
