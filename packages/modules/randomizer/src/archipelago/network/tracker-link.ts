/* @layer core @kind logic */
import type { ArchipelagoSocket } from '../protocol/socket.type';
import type { ApServerPacket } from '../protocol/server-packets.type';
import { parseServerPackets } from './parse-server-packets';
import { trackerConnectPacket } from './tracker-connect-packet';
import { TRACKER_RETRY_MAX_MS, TRACKER_RETRY_MIN_MS } from './tracker-link.constants';
import type { TrackerLink, TrackerLinkConfig } from './tracker-link.type';
import { wireList } from './wire-list';

const createTrackerLink = (config: TrackerLinkConfig): TrackerLink => {
  const { url, createSocket, onChange } = config;
  const checked = new Set<number>();
  let total: number | null = null;
  let linked = false;
  let ended = false;
  let socket: ArchipelagoSocket | null = null;
  let retryMs = TRACKER_RETRY_MIN_MS;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const handle = (packet: ApServerPacket): void => {
    if (packet.cmd === 'RoomInfo') {
      socket?.send(JSON.stringify([trackerConnectPacket(config, packet)]));
    } else if (packet.cmd === 'Connected') {
      checked.clear();
      for (const id of wireList(packet.checked_locations)) checked.add(id);
      total = checked.size + wireList(packet.missing_locations).length;
      linked = true;
      retryMs = TRACKER_RETRY_MIN_MS;
    } else if (packet.cmd === 'RoomUpdate') {
      for (const id of wireList(packet.checked_locations)) checked.add(id);
    } else if (packet.cmd === 'ConnectionRefused') {
      ended = true;
      socket?.close();
    }
  };

  const connect = (): void => {
    const next = createSocket(url);
    socket = next;
    next.onOpen(() => undefined);
    next.onMessage((text) => {
      for (const packet of parseServerPackets(text)) handle(packet);
      onChange();
    });
    next.onClose(() => {
      socket = null;
      linked = false;
      if (!ended) {
        retryTimer = setTimeout(connect, retryMs);
        retryMs = Math.min(retryMs * 2, TRACKER_RETRY_MAX_MS);
      }
      onChange();
    });
  };

  connect();

  return {
    get progress() { return total === null ? null : { checked: checked.size, total }; },
    get linked() { return linked; },
    close() {
      ended = true;
      if (retryTimer !== null) clearTimeout(retryTimer);
      retryTimer = null;
      linked = false;
      socket?.close();
    },
  };
};

export { createTrackerLink };
