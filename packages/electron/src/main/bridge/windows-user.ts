/* @layer electron-main @kind logic */
import type { SystemToolRun, WindowsUser } from './bridge.type';
import { BRIDGE_WHOAMI_ARGS } from './bridge.constants';
import { knownWindowsUser } from './known-windows-user';
import { runSystemTool } from './run-system-tool';
import { userOfWhoami } from './user-of-whoami';

const windowsUser = (run: SystemToolRun = runSystemTool): WindowsUser => {
  if (knownWindowsUser.user && run === runSystemTool) return knownWindowsUser.user;
  const user = userOfWhoami(run('whoami.exe', BRIDGE_WHOAMI_ARGS));
  if (run === runSystemTool) knownWindowsUser.user = user;
  return user;
};

export { windowsUser };
