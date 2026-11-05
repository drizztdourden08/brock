/* @layer renderer-shell @kind logic */
import type { JoinConfig } from '../../../archipelago/lobby';
import { archipeliaOf } from '../game/archipelia-of';
import type { JoinInput } from './join-input.type';

const joinConfigOf = (input: JoinInput): JoinConfig => {
  const { server, lobby, ap, slotName, yaml, build, bytes, client, seat, token } = input;
  const { archipelia, game } = archipeliaOf();
  return {
    server,
    lobby,
    client,
    archipelagoVersion: ap,
    world: { worldVersion: archipelia.worldVersion, bytes, sha256: build.sha256, size: build.size, game, module: archipelia.module },
    slots: [{ name: slotName, yaml }],
    displayName: slotName,
    ...(seat === undefined ? {} : { seat }),
    token: token ?? null,
  };
};

export { joinConfigOf };
