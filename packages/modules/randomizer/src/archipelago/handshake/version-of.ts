/* @layer core @kind logic */
import type { ApVersion } from '../protocol/protocol.type';
import type { ApRoomInfoPacket } from '../protocol/server-packets.type';
import { FALLBACK_VERSION } from './handshake.constants';

const versionOf = (roomInfo: ApRoomInfoPacket): ApVersion => {
  const { version } = roomInfo;
  if (!version || typeof version.major !== 'number') return FALLBACK_VERSION;
  return { major: version.major, minor: version.minor, build: version.build, class: 'Version' };
};

export { versionOf };
