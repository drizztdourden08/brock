/* @layer electron-main @kind logic */
import type { AsyncSystemToolRun, WindowsUser } from './bridge.type';
import { BRIDGE_WHOAMI_ARGS } from './bridge.constants';
import { knownWindowsUser } from './known-windows-user';
import { runSystemToolAsync } from './run-system-tool-async';
import { userOfWhoami } from './user-of-whoami';

const windowsUserAsync = async (run: AsyncSystemToolRun = runSystemToolAsync): Promise<WindowsUser> => {
  if (knownWindowsUser.user && run === runSystemToolAsync) return knownWindowsUser.user;
  const user = userOfWhoami(await run('whoami.exe', BRIDGE_WHOAMI_ARGS));
  if (run === runSystemToolAsync) knownWindowsUser.user = user;
  return user;
};

export { windowsUserAsync };
