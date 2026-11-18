/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { REVIEW_MASK } from '@drizztdourden08/brock-core/review';
import { JobDialog as TaskDialog } from '@drizztdourden08/tessera/composites';
import { Span } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../i18n';
import { jobLogKinds } from './behavior/job-log-kinds';
import { jobLogRows } from './behavior/job-log-rows';
import { jobStepper } from '../job-stepper';
import { JOB_ID_ATTRIBUTE } from './JobDialog.constants';
import type { JobDialogProps } from './JobDialog.type';

const JobDialog = (props: JobDialogProps) => {
  const { job, onHide, onCancel, onClose } = props;
  const t = useT();
  const stepper = useMemo(() => jobStepper(job, t('brock-app:jobs.step.skipped')), [job, t]);
  const logKinds = useMemo(() => jobLogKinds(t), [t]);
  const rows = useMemo(() => jobLogRows(job.log), [job.log]);
  return (
    <TaskDialog
      open
      title={job.title}
      data={{ [JOB_ID_ATTRIBUTE]: job.id }}
      state={job.state}
      percent={Math.round(job.progress * 100)}
      line={job.line === null ? undefined : <Span {...REVIEW_MASK}>{job.line}</Span>}
      steps={stepper.steps}
      currentId={stepper.currentId}
      error={job.error ?? undefined}
      log={rows}
      logKinds={logKinds}
      label={job.title}
      onHide={onHide}
      onCancel={job.cancellable ? onCancel : undefined}
      onClose={onClose}
    />
  );
};

export { JobDialog };
