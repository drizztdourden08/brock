/* @layer renderer-shell @kind logic */
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';

const stepLabel = (job: JobSnapshot): string | null =>
  job.steps.find((step) => step.id === job.currentStep)?.label ?? null;

const jobBarStatus = (job: JobSnapshot): string => {
  if (job.state !== 'running') return `${job.title}: ${job.state}`;
  const percent = `${Math.round(job.progress * 100)}%`;
  const label = stepLabel(job);
  return label === null ? `${job.title} ${percent}` : `${job.title}: ${label} ${percent}`;
};

export { jobBarStatus };
