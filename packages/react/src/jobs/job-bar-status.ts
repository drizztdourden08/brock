/* @layer renderer-shell @kind logic */
import type { I18n, Text } from '@drizztdourden08/brock-core/i18n';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { fallbackText } from '../i18n/fallback-text';

const stepLabel = (job: JobSnapshot, text: (value: Text) => string): string | null => {
  const step = job.steps.find((entry) => entry.id === job.currentStep);
  return step ? text(step.label) : null;
};

const jobBarStatus = (job: JobSnapshot, t: I18n['t'], text: (value: Text) => string = fallbackText): string => {
  const title = text(job.title);
  if (job.state !== 'running') return t('brock-app:jobs.bar.finished', { title, state: t(`brock-app:jobs.state.${job.state}`) });
  const percent = `${Math.round(job.progress * 100)}%`;
  const label = stepLabel(job, text);
  return label === null ? t('brock-app:jobs.bar.progress', { title, percent }) : t('brock-app:jobs.bar.step', { title, label, percent });
};

export { jobBarStatus };
