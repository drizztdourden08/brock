/* @layer renderer-shell @kind logic */
import { apConnectFlag } from './flags/ap-connect-flag';
import { lobbyJoinFlag } from './flags/lobby-join-flag';
import type { LaunchConnectHost } from './launch-connect.type';

const launchesConnection = (log: LaunchConnectHost['log']): boolean =>
  apConnectFlag(log).kind !== 'absent' || lobbyJoinFlag(log).kind !== 'absent';

export { launchesConnection };
