/* @layer core @kind logic */
import type { JobLogLine } from '../types/job.type';
import { JOB_LOG_LINE_OVERHEAD } from './jobs.constants';

const tailLog = (log: readonly JobLogLine[], maxBytes: number): JobLogLine[] => {
  let size = 0;
  let from = log.length;
  while (from > 0) {
    const line = log[from - 1];
    size += (line?.message.length ?? 0) + JOB_LOG_LINE_OVERHEAD;
    if (size > maxBytes && from < log.length) break;
    from -= 1;
  }
  return log.slice(from);
};

export { tailLog };
