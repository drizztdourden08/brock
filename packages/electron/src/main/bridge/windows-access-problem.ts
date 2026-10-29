/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_ACL_ARGS, BRIDGE_POWERSHELL } from './bridge.constants';
import { accessStamp } from './access-stamp';
import { aclOutputLines } from './acl-output-lines';
import { aclPowershellOptions } from './acl-powershell-options';
import { aclProblem } from './acl-problem';
import { isAccepted } from './is-accepted';
import { rememberAccepted } from './remember-accepted';
import { runSystemTool } from './run-system-tool';
import { unreadableAcl } from './unreadable-acl';
import { windowsUser } from './windows-user';

const checkedProblem = (file: string, run: SystemToolRun): string | null => {
  try {
    return aclProblem(aclOutputLines(run(BRIDGE_POWERSHELL, BRIDGE_ACL_ARGS, aclPowershellOptions(file))), windowsUser(run).sid);
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
