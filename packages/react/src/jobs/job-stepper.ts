/* @layer renderer-shell @kind logic */
import type { StepperStep } from '@drizztdourden08/tessera/primitives';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { fallbackText } from '../i18n/fallback-text';

const failedStep = (job: JobSnapshot): string | null => job.steps.find((step) => step.state === 'failed')?.id ?? null;

const jobStepper = (job: JobSnapshot, skippedLabel: string, text: (value: Text) => string = fallbackText): { steps: StepperStep[]; currentId: string } => {
  const steps: StepperStep[] = job.steps.map((step) => ({
    id: step.id,
    label: text(step.label),
    error: step.state === 'failed',
    summary: step.state === 'skipped' ? skippedLabel : undefined,
  }));
  const currentId = failedStep(job) ?? job.currentStep ?? job.steps[0]?.id ?? '';
  return { steps, currentId };
};

export { jobStepper };
