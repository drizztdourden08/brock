/* @layer core @kind logic */
import type { JobStepWire } from '../types/job.type';

const jobProgress = (steps: readonly JobStepWire[], stepProgress: number): number => {
  const total = steps.reduce((sum, step) => sum + step.weight, 0);
  if (total <= 0) return stepProgress;
  const finished = steps.reduce((sum, step) => {
    if (step.state === 'done' || step.state === 'skipped') return sum + step.weight;
    return step.state === 'current' ? sum + step.weight * stepProgress : sum;
  }, 0);
  return Math.min(1, Math.max(0, finished / total));
};

export { jobProgress };
