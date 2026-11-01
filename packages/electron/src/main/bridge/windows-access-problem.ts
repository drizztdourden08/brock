/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { FileSecurityReader, SystemToolRun } from './bridge.type';
import { accessStamp } from './access-stamp';
import { isAccepted } from './is-accepted';
import { readFileSecurity } from './read-file-security';
import { rememberAccepted } from './remember-accepted';
import { runSystemTool } from './run-system-tool';
import { securityVerdict } from './security-verdict';
import { unreadableAcl } from './unreadable-acl';
import { windowsUser } from './windows-user';

const checkedProblem = (file: string, readSecurity: FileSecurityReader, run: SystemToolRun): string | null => {
  try {
    return securityVerdict(readSecurity(file), windowsUser(run).sid);
  } catch (error) {
    return unreadableAcl(error);
  }
};

const windowsAccessProblem = (file: string, readSecurity: FileSecurityReader = readFileSecurity, run: SystemToolRun = runSystemTool): string | null => {
  const full = resolve(file);
  const stamp = accessStamp(full);
  if (isAccepted(full, stamp)) return null;
  const problem = checkedProblem(full, readSecurity, run);
  if (problem === null) rememberAccepted(full, stamp);
  return problem;
};

export { windowsAccessProblem };
