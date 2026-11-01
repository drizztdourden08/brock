/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { accessStamp } from './access-stamp';
import { icaclsProblem } from './icacls-problem';
import { isAccepted } from './is-accepted';
import { rememberAccepted } from './remember-accepted';
import { runSystemTool } from './run-system-tool';
import { unreadableAcl } from './unreadable-acl';

const checkedProblem = (file: string, run: SystemToolRun): string | null => {
  try {
    return icaclsProblem(file, run);
  } catch (error) {
    return unreadableAcl(error);
  }
};

const windowsAccessProblem = (file: string, run: SystemToolRun = runSystemTool): string | null => {
  const full = resolve(file);
  const stamp = accessStamp(full);
  if (isAccepted(full, stamp)) return null;
  const problem = checkedProblem(full, run);
  if (problem === null) rememberAccepted(full, stamp);
  return problem;
};

export { windowsAccessProblem };
