/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { useT, useText } from '../i18n';
import { jobBarStatus } from './job-bar-status';
import { jobs } from './jobs';
import { JOB_BAR_ID, JOB_BAR_TONE } from './jobs.constants';
import { useJobStore } from './useJobStore';

const useJobTitleBarAction = (): WindowTitleBarAction | null => {
  const t = useT();
  const text = useText();
  const job = useJobStore((s) => Object.values(s.jobs).filter((entry) => entry.visible && entry.id !== s.shown).sort((a, b) => b.startedAt - a.startedAt)[0] ?? null);
  if (!job) return null;
  return { id: JOB_BAR_ID, label: t('brock-app:jobs.bar.label'), icon: 'loader-circle', bar: 'status', status: jobBarStatus(job, t, text), tone: JOB_BAR_TONE[job.state], pulse: job.state === 'running', onSelect: () => jobs.open(job.id) };
};

export { useJobTitleBarAction };
