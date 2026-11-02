/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { AsyncSystemToolRun, FileSecurityReader } from './bridge.type';
import { accessStamp } from './access-stamp';
import { isAccepted } from './is-accepted';
import { readFileSecurity } from './read-file-security';
import { rememberAccepted } from './remember-accepted';
import { runSystemToolAsync } from './run-system-tool-async';
import { securityVerdict } from './security-verdict';
import { unreadableAcl } from './unreadable-acl';
import { windowsUserAsync } from './windows-user-async';

const checkedProblem = async (file: string, readSecurity: FileSecurityReader, run: AsyncSystemToolRun): Promise<string | null> => {
  try {
    const user = await windowsUserAsync(run);
    return securityVerdict(readSecurity(file), user.sid);
  } catch (error) {
    return unreadableAcl(error);
  }
};

const windowsAccessProblemAsync = async (file: string, readSecurity: FileSecurityReader = readFileSecurity, run: AsyncSystemToolRun = runSystemToolAsync): Promise<string | null> => {
  const full = resolve(file);
  const stamp = accessStamp(full);
  if (isAccepted(full, stamp)) return null;
  const problem = await checkedProblem(full, readSecurity, run);
  if (problem === null) rememberAccepted(full, stamp);
  return problem;
};

export { windowsAccessProblemAsync };
