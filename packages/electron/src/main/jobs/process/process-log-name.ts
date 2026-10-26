/* @layer electron-main @kind logic */
import { PROCESS_LOG_EXTENSION } from './process-job.constants';

const processLogName = (id: string, now: Date): string => {
  const safe = id.replace(/[^A-Za-z0-9._-]/g, '_');
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  return `${safe}-${stamp}${PROCESS_LOG_EXTENSION}`;
};

export { processLogName };
