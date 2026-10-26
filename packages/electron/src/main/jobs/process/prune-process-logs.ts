/* @layer electron-main @kind logic */
import { readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { PROCESS_LOG_EXTENSION } from './process-job.constants';
import type { LogEntry } from './prune-process-logs.type';

const listLogs = (dir: string): LogEntry[] => {
  try {
    return readdirSync(dir)
      .filter((name) => name.endsWith(PROCESS_LOG_EXTENSION))
      .map((name) => ({ name, time: statSync(join(dir, name)).mtimeMs }));
  } catch {
    return [];
  }
};

const removeLog = (dir: string, name: string): boolean => {
  try {
    rmSync(join(dir, name), { force: true });
    return true;
  } catch {
    return false;
  }
};

const pruneProcessLogs = (dir: string, keep: number): number => {
  const newestFirst = listLogs(dir).sort((a, b) => b.time - a.time || (a.name < b.name ? 1 : -1));
  return newestFirst.slice(Math.max(keep, 0)).filter((file) => removeLog(dir, file.name)).length;
};

export { pruneProcessLogs };
