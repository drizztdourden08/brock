/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { AsyncSystemToolRun } from './bridge.type';
import { accessStamp } from './access-stamp';
import { icaclsProblemAsync } from './icacls-problem-async';
import { isAccepted } from './is-accepted';
import { rememberAccepted } from './remember-accepted';
import { runSystemToolAsync } from './run-system-tool-async';
import { unreadableAcl } from './unreadable-acl';

const checkedProblem = async (file: string, run: AsyncSystemToolRun): Promise<string | null> => {
  try {
    return await icaclsProblemAsync(file, run);
  } catch (error) {
    return unreadableAcl(error);
  }
};

const windowsAccessProblemAsync = async (file: string, run: AsyncSystemToolRun = runSystemToolAsync): Promise<string | null> => {
  const full = resolve(file);
  const stamp = accessStamp(full);
  if (isAccepted(full, stamp)) return null;
  const problem = await checkedProblem(full, run);
  if (problem === null) rememberAccepted(full, stamp);
  return problem;
};

export { windowsAccessProblemAsync };
