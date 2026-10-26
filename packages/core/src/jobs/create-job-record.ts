/* @layer core @kind logic */
import type { JobLogLine, JobSnapshot, JobState } from '../types/job.type';
import type { EmitJob, JobRecord, JobRecordInput } from './job-handle.type';
import { JOB_EMIT_LOG_BYTES, JOB_EMIT_MS } from './jobs.constants';
import { tailLog } from './tail-log';

const initialSnapshot = ({ id, steps, options, at }: JobRecordInput): JobSnapshot => ({
  id,
  title: options.title ?? id,
  state: 'running',
  steps: steps.map((step) => ({ id: step.id, label: step.label, weight: step.weight ?? 1, state: 'upcoming' })),
  currentStep: null,
  progress: 0,
  stepProgress: 0,
  line: null,
  error: null,
  log: [],
  startedAt: at,
  endedAt: null,
  cancellable: options.cancellable ?? true,
  visible: options.visible ?? true,
});

const createNotifier = (snapshot: JobSnapshot, emit: EmitJob): ((urgent: boolean) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
    emit({ ...snapshot, steps: snapshot.steps.map((step) => ({ ...step })), log: tailLog(snapshot.log, JOB_EMIT_LOG_BYTES) });
  };
  return (urgent) => {
    if (urgent) flush();
    else timer ??= setTimeout(flush, JOB_EMIT_MS);
  };
};

const createJobRecord = (input: JobRecordInput): JobRecord => {
  const snapshot = initialSnapshot(input);
  const notifier = createNotifier(snapshot, input.emit);
  const { id, options, sink } = input;
  let settle: (state: JobState) => void = () => undefined;
  const ended = new Promise<JobState>((resolve) => { settle = resolve; });
  const notify = (urgent: boolean): void => {
    notifier(urgent);
    if (snapshot.state === 'running') return;
    settle(snapshot.state);
    input.onEnd();
  };
  const forward = options.forwardLog && sink ? (line: JobLogLine) => sink(id, line) : null;
  return { snapshot, controller: input.controller, notify, forward, ended, outcome: null };
};

export { createJobRecord };
