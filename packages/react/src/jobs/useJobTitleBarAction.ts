/* @layer renderer-shell @kind hook */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { JobSnapshot } from '@drizztdourden08/brock-core/types';
import { jobs } from './jobs';
import { JOB_BAR_ID, JOB_BAR_TONE } from './jobs.constants';
import { useJobStore } from './useJobStore';

const statusOf = (job: JobSnapshot): string =>
  (job.state === 'running' ? `${job.title} ${Math.round(job.progress * 100)}%` : `${job.title}: ${job.state}`);

const useJobTitleBarAction = (): WindowTitleBarAction | null => {
  const job = useJobStore((s) => Object.values(s.jobs).filter((entry) => entry.id !== s.shown).sort((a, b) => b.startedAt - a.startedAt)[0] ?? null);
  if (!job) return null;
  return { id: JOB_BAR_ID, label: job.title, icon: 'loader-circle', bar: 'status', status: statusOf(job), tone: JOB_BAR_TONE[job.state], onSelect: () => jobs.open(job.id) };
};

export { useJobTitleBarAction };
