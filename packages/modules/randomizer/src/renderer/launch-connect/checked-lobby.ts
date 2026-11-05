/* @layer renderer-shell @kind logic */
import { checkLobby } from '../archipelia/check/check-lobby';
import type { LobbyCheckOk } from '../archipelia/check/lobby-check.type';
import type { LaunchConnectHost } from './launch-connect.type';
import { refuseLobbyJoin } from './refuse-lobby-join';

const checkedLobby = async (host: LaunchConnectHost, server: string, code: string): Promise<LobbyCheckOk | null> => {
  const check = await checkLobby(server, { code });
  if (check.kind === 'error') return refuseLobbyJoin(host, check.text, check.code);
  if (check.kind !== 'ok') return refuseLobbyJoin(host, 'the lobby check did not finish');
  return check;
};

export { checkedLobby };
