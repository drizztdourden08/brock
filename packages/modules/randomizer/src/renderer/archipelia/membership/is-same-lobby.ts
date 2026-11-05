/* @layer renderer-shell @kind logic */
import { formatLobbyRef, lobbyUrlCandidates } from '../../../archipelago/lobby';
import type { LobbyRef } from '../../../archipelago/lobby';
import type { ArchipeliaMembership } from './membership.type';

const lobbyUrlOf = (server: string): string => lobbyUrlCandidates(server)[0] ?? server.trim().toLowerCase();

const refKeyOf = (lobby: LobbyRef): string => {
  const ref = formatLobbyRef(lobby);
  return ref === null ? '' : (ref.joinToken ?? ref.code);
};

const isSameLobby = (membership: ArchipeliaMembership, server: string, lobby: LobbyRef): boolean => {
  const key = refKeyOf(lobby);
  return key !== '' && refKeyOf(membership.lobby) === key && lobbyUrlOf(membership.server) === lobbyUrlOf(server);
};

export { isSameLobby };
