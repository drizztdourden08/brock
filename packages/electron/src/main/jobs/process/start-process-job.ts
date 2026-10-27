/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { PROCESS_LOG_FOLDER, PROCESS_STEP_ID } from './process-job.constants';
import type { ProcessJobsDeps, ProcessStartInput } from './process-job.type';
import { runProcess } from './run-process';

const startProcessJob = (deps: ProcessJobsDeps, { id, spec, options, track }: ProcessStartInput): Promise<ProcessJobOutcome> => {
  const cancellable = options.cancellable ?? true;
  const job = deps.job(id, [{ id: PROCESS_STEP_ID, label: options.label }], { title: options.label, cancellable });
  job.step(PROCESS_STEP_ID);
  const cwd = spec.cwd ?? deps.context().paths.userData();
  const logDir = deps.context().paths.data('debug', PROCESS_LOG_FOLDER);
  return runProcess(job, { ...spec, cwd }, { ...options, track, logDir });
};

export { startProcessJob };
