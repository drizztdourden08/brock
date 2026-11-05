/* @layer renderer-shell @kind logic */
import { parseLobbyJoin } from '../../../archipelago/launch-flags';
import type { LobbyJoin } from '../../../archipelago/launch-flags';
import type { LaunchConnectHost, LaunchFlag } from '../launch-connect.type';
import { parsedFlag } from './parsed-flag';

const lobbyJoinFlag = (log: LaunchConnectHost['log']): LaunchFlag<LobbyJoin> => parsedFlag('lobby-join', parseLobbyJoin, log);

export { lobbyJoinFlag };
