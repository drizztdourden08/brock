/* @layer renderer-shell @kind logic */
import type { StepperStep } from '@drizztdourden08/tessera/primitives';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { FINISHED_STEP, JOB_STATE_LABEL } from '../JobDialog.constants';

const failedStep = (job: JobSnapshot): string | null => job.steps.find((step) => step.state === 'failed')?.id ?? null;

const jobStepper = (job: JobSnapshot): { steps: StepperStep[]; currentId: string } => {
  const steps: StepperStep[] = job.steps.map((step) => ({
    id: step.id,
    label: step.label,
    error: step.state === 'failed',
    summary: step.state === 'skipped' ? 'Skipped' : undefined,
  }));
  if (job.state === 'done') return { steps: [...steps, { id: FINISHED_STEP, label: JOB_STATE_LABEL.done }], currentId: FINISHED_STEP };
  const currentId = failedStep(job) ?? job.currentStep ?? job.steps[0]?.id ?? '';
  return { steps, currentId };
};

export { jobStepper };
