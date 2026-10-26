/* @layer electron-main @kind logic */
import { readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';
import { PROCESS_LOG_EXTENSION } from './process-job.constants';

const pruneProcessLogs = (dir: string, keep: number): void => {
  try {
    const files = readdirSync(dir)
      .filter((name) => name.endsWith(PROCESS_LOG_EXTENSION))
      .map((name) => ({ name, time: statSync(join(dir, name)).mtimeMs }))
      .sort((a, b) => b.time - a.time || (a.name < b.name ? 1 : -1));
    for (const file of files.slice(Math.max(keep, 0))) rmSync(join(dir, file.name), { force: true });
  } catch {
    return;
  }
};

export { pruneProcessLogs };
