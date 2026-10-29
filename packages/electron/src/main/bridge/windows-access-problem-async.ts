/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { AsyncSystemToolRun } from './bridge.type';
import { BRIDGE_ACL_ARGS, BRIDGE_POWERSHELL } from './bridge.constants';
import { accessStamp } from './access-stamp';
import { aclOutputLines } from './acl-output-lines';
import { aclPowershellOptions } from './acl-powershell-options';
import { aclProblem } from './acl-problem';
import { fastAccessCheck } from './fast-access-check';
import { isAccepted } from './is-accepted';
import { rememberAccepted } from './remember-accepted';
import { runSystemToolAsync } from './run-system-tool-async';
import { unreadableAcl } from './unreadable-acl';
import { windowsUserAsync } from './windows-user-async';

const fullProblem = async (file: string, run: AsyncSystemToolRun): Promise<string | null> => {
  try {
    const [output, user] = await Promise.all([run(BRIDGE_POWERSHELL, BRIDGE_ACL_ARGS, aclPowershellOptions(file)), windowsUserAsync(run)]);
    return aclProblem(aclOutputLines(output), user.sid);
  } catch (error) {
    return unreadableAcl(error);
  }
};

const checkedProblem = async (file: string, run: AsyncSystemToolRun): Promise<string | null> => ((await fastAccessCheck(file, run)) ? null : fullProblem(file, run));

const windowsAccessProblemAsync = async (file: string, run: AsyncSystemToolRun = runSystemToolAsync): Promise<string | null> => {
  const full = resolve(file);
  const stamp = accessStamp(full);
  if (isAccepted(full, stamp)) return null;
  const problem = await checkedProblem(full, run);
  if (problem === null) rememberAccepted(full, stamp);
  return problem;
};

export { windowsAccessProblemAsync };
