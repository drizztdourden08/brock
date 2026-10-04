/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { DialogShell, LogPanel } from '@drizztdourden08/tessera/composites';
import { Callout, ProgressBar, Stack, Stepper, Text } from '@drizztdourden08/tessera/primitives';
import { jobLogRows } from './behavior/job-log-rows';
import { jobStepper } from './behavior/job-stepper';
import { JOB_LOG_KINDS, JOB_STATE_LABEL } from './JobDialog.constants';
import type { JobDialogProps } from './JobDialog.type';
import { JobDialogActions } from './sub-components/JobDialogActions';

const JobDialog = (props: JobDialogProps) => {
  const { job, onHide, onCancel, onClose } = props;
  const stepper = useMemo(() => jobStepper(job), [job]);
  const rows = useMemo(() => jobLogRows(job.log), [job.log]);
  const percent = Math.round(job.progress * 100);
  const running = job.state === 'running';
  return (
    <DialogShell
      open
      onClose={running ? onHide : onClose}
      title={job.title}
      headerExtra={<Text variant="caption">{running ? `${percent}%` : JOB_STATE_LABEL[job.state]}</Text>}
      actions={<JobDialogActions job={job} onHide={onHide} onCancel={onCancel} onClose={onClose} />}
    >
      <Stack gap="md" data-job={job.id} data-job-state={job.state}>
        <Stepper steps={stepper.steps} currentId={stepper.currentId} compact label={job.title} />
        <ProgressBar value={percent} label={`${job.title}: ${percent}%`} tone={job.state === 'failed' ? 'danger' : 'primary'} live={running} />
        {job.line !== null && <Text variant="caption">{job.line}</Text>}
        {job.error !== null && <Callout tone="danger">{job.error}</Callout>}
        {rows.length > 0 && <LogPanel rows={rows} kinds={JOB_LOG_KINDS} toolbar={false} emptyLabel="Nothing logged yet." />}
      </Stack>
    </DialogShell>
  );
};

export { JobDialog };
