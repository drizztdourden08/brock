/* @layer core @kind logic */
import { versionOf } from '../handshake/version-of';
import type { ApRoomInfoPacket } from '../protocol/server-packets.type';
import type { ProbeResult } from './probe.type';

const roomInfoResult = (packet: ApRoomInfoPacket, url: string, game: string | undefined): ProbeResult => {
  const { major, minor, build } = versionOf(packet);
  const version = `${major}.${minor}.${build}`;
  if (game !== undefined && !packet.games.includes(game)) {
    return { ok: false, reason: `the room (server ${version}) has no ${game} slot` };
  }
  return { ok: true, url, version };
};

export { roomInfoResult };
