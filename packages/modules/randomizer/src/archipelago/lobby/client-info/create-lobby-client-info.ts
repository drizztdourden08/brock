/* @layer core @kind logic */
import type { ClientInfo } from '@drizztdourden08/archipelia-lobby-protocol';
import { LOBBY_SDK } from '../lobby.constants';
import type { ClientInfoInput, LobbyClientIdentity } from './client-info.type';

const createLobbyClientInfo = (
  identity: LobbyClientIdentity,
  { version, build, signed, platform }: ClientInfoInput,
): ClientInfo => {
  const info: ClientInfo = {
    id: signed === true ? identity.id : identity.unsignedId,
    name: signed === true ? identity.name : identity.unsignedName,
    version,
    platform,
    homepage: identity.homepage,
    sdk: LOBBY_SDK,
  };
  if (build !== undefined && build !== '') info.build = build;
  return info;
};

export { createLobbyClientInfo };
