/* @layer renderer-shell @kind logic */
import { INITIAL_LOBBY_FORM } from './lobby-form.constants';
import type { LobbyForm } from './lobby-form.type';

const lobbyFormOfConnection = (connection: Readonly<Record<string, unknown>> | undefined): LobbyForm => {
  const { lobby, lobbyCheck } = (connection ?? {}) as Partial<LobbyForm>;
  return { lobby: lobby ?? INITIAL_LOBBY_FORM.lobby, lobbyCheck: lobbyCheck ?? INITIAL_LOBBY_FORM.lobbyCheck };
};

export { lobbyFormOfConnection };
