/* @layer electron-main @kind logic */
import { mkdirSync, openSync } from 'fs';
import { join } from 'path';
import type { LogState } from './create-process-log.type';
import { PROCESS_LOG_KEEP } from './process-job.constants';
import { processLogName } from './process-log-name';
import { pruneProcessLogs } from './prune-process-logs';

const openLogFile = (state: LogState, dir: string, id: string): boolean => {
  try {
    mkdirSync(dir, { recursive: true });
    pruneProcessLogs(dir, PROCESS_LOG_KEEP - 1);
    const path = join(dir, processLogName(id, new Date()));
    state.fd = openSync(path, 'w');
    state.path = path;
    return true;
  } catch {
    state.broken = true;
    return false;
  }
};

export { openLogFile };
