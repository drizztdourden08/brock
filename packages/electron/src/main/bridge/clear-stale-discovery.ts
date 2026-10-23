/* @layer electron-main @kind logic */
import { existsSync, readFileSync, rmSync } from 'fs';
import { isProcessAlive } from './is-process-alive';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const recordedPid = (file: string): number | null => {
  try {
    const data = parseJson(readFileSync(file, 'utf8'));
    return isRecord(data) && typeof data.pid === 'number' ? data.pid : null;
  } catch {
    return null;
  }
};

const clearStaleDiscovery = (file: string): boolean => {
  if (!existsSync(file)) return false;
  const pid = recordedPid(file);
  if (pid !== null && pid !== process.pid && isProcessAlive(pid)) return false;
  rmSync(file, { force: true });
  return true;
};

export { clearStaleDiscovery };
