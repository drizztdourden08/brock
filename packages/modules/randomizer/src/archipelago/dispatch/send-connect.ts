/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';
import { clientUuid } from '../handshake/client-uuid';
import { buildConnectPacket } from '../handshake/connect-packet';
import { versionOf } from '../handshake/version-of';

const sendConnect = (ctx: OnlineContext): void => {
  const { room, game } = ctx;
  if (room.gameData === null) {
    ctx.fail(`[Online] Server data package has no entry for ${game}`);
    return;
  }
  const { slotName, password, deathLink } = ctx.connection();
  const version = room.roomInfo ? versionOf(room.roomInfo) : undefined;
  ctx.send(buildConnectPacket({ game, slotName, uuid: clientUuid(), password, version, deathLink }));
};

export { sendConnect };
