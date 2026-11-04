/* @layer core @kind logic */
import type { ApConnectPacket } from '../protocol/client-packets.type';
import type { ApRoomInfoPacket } from '../protocol/server-packets.type';
import { FALLBACK_VERSION, NO_ITEMS_HANDLING, TRACKER_TAGS } from './tracker-link.constants';
import type { TrackerLinkConfig } from './tracker-link.type';

const trackerConnectPacket = (config: TrackerLinkConfig, info: ApRoomInfoPacket): ApConnectPacket => ({
  cmd: 'Connect',
  game: '',
  name: config.name,
  password: config.password === '' ? null : (config.password ?? null),
  uuid: config.uuid,
  version: info.version ?? { ...FALLBACK_VERSION },
  items_handling: NO_ITEMS_HANDLING,
  tags: [...TRACKER_TAGS],
  slot_data: false,
});

export { trackerConnectPacket };
