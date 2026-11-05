/* @layer renderer-shell @kind logic */
import type { LaunchConnectHost } from './launch-connect.type';

const refuseLobbyJoin = (host: LaunchConnectHost, why: string, code?: string): null => {
  host.log(`--lobby-join refused: ${why}`, 'error');
  host.onLobbyRefused?.(why, code);
  return null;
};

export { refuseLobbyJoin };
