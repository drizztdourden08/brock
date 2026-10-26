/* @layer electron-main @kind logic */
import { createProcessLog } from './create-process-log';
import { PROCESS_LOG_MAX_BYTES } from './process-job.constants';
import type { ProcessLog, ProcessRunInput } from './process-job.type';

const openProcessLog = (id: string, options: ProcessRunInput): ProcessLog | null => {
  if (!options.logDir || options.log === false || options.logFile === false) return null;
  return createProcessLog({ dir: options.logDir, id, maxBytes: options.logFile?.maxBytes ?? PROCESS_LOG_MAX_BYTES });
};

export { openProcessLog };
