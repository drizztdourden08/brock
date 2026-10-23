/* @layer electron-main @kind logic */
import type { SystemToolRun, WindowsUser } from './bridge.type';
import { BRIDGE_WHOAMI } from './bridge.constants';
import { runSystemTool } from './run-system-tool';

const known: { user: WindowsUser | null } = { user: null };

const windowsUser = (run: SystemToolRun = runSystemTool): WindowsUser => {
  if (known.user && run === runSystemTool) return known.user;
  const sid = BRIDGE_WHOAMI.exec(run('whoami.exe', ['/user', '/fo', 'csv', '/nh']).toString('latin1'))?.[1];
  if (!sid) throw new Error('could not tell which Windows user runs this process');
  const user = { sid };
  if (run === runSystemTool) known.user = user;
  return user;
};

export { windowsUser };
