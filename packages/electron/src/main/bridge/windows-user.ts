/* @layer electron-main @kind logic */
import type { SystemToolRun, WindowsUser } from './bridge.type';
import { BRIDGE_WHOAMI } from './bridge.constants';
import { runSystemTool } from './run-system-tool';

const known: { user: WindowsUser | null } = { user: null };

const windowsUser = (run: SystemToolRun = runSystemTool): WindowsUser => {
  if (known.user) return known.user;
  const match = BRIDGE_WHOAMI.exec(run('whoami.exe', ['/user', '/fo', 'csv', '/nh']).trim());
  if (!match?.[1] || !match[2]) throw new Error('could not tell which Windows user runs this process');
  known.user = { name: match[1], sid: match[2] };
  return known.user;
};

export { windowsUser };
