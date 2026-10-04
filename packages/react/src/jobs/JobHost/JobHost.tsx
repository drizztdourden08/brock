/* @layer renderer-shell @kind component */
import { jobs } from '../jobs';
import { JobDialog } from '../JobDialog';
import { useJobBridge } from '../useJobBridge';
import { useJobStore } from '../useJobStore';

const JobHost = () => {
  useJobBridge();
  const job = useJobStore((s) => (s.shown === null ? null : s.jobs[s.shown] ?? null));
  if (!job) return null;
  return <JobDialog job={job} onHide={jobs.hide} onCancel={() => jobs.cancel(job.id)} onClose={() => jobs.dismiss(job.id)} />;
};

export { JobHost };
