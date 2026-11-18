/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';

const stepLabel = (job: JobSnapshot): string | null =>
  job.steps.find((step) => step.id === job.currentStep)?.label ?? null;

const jobBarStatus = (job: JobSnapshot, t: I18n['t']): string => {
  if (job.state !== 'running') return t('brock-app:jobs.bar.finished', { title: job.title, state: t(`brock-app:jobs.state.${job.state}`) });
  const percent = `${Math.round(job.progress * 100)}%`;
  const label = stepLabel(job);
  return label === null ? t('brock-app:jobs.bar.progress', { title: job.title, percent }) : t('brock-app:jobs.bar.step', { title: job.title, label, percent });
};

export { jobBarStatus };
