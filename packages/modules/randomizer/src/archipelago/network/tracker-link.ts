/* @layer core @kind logic */
import { parseServerPackets } from '../handshake/parse-server-packets';
import type { ApServerPacket } from '../protocol/server-packets.type';
import { createReconnector } from '../reconnect/reconnector';
import { openSocketLink } from '../socket/socket-link';
import type { SocketLink } from '../socket/socket-link.type';
import { trackerConnectPacket } from './tracker-connect-packet';
import type { TrackerLink, TrackerLinkConfig } from './tracker-link.type';
import { wireList } from './wire-list';

const createTrackerLink = (config: TrackerLinkConfig): TrackerLink => {
  const { url, createSocket, onChange } = config;
  const checked = new Set<number>();
  let total: number | null = null;
  let linked = false;
  let ended = false;
  let link: SocketLink | null = null;

  const handle = (packet: ApServerPacket): void => {
    if (packet.cmd === 'RoomInfo') {
      link?.send(JSON.stringify([trackerConnectPacket(config, packet)]));
    } else if (packet.cmd === 'Connected') {
      checked.clear();
      for (const id of wireList(packet.checked_locations)) checked.add(id);
      total = checked.size + wireList(packet.missing_locations).length;
      linked = true;
      reconnector.reset();
    } else if (packet.cmd === 'RoomUpdate') {
      for (const id of wireList(packet.checked_locations)) checked.add(id);
    } else if (packet.cmd === 'ConnectionRefused') {
      ended = true;
      link?.close();
    }
  };

  const connect = (): void => {
    link = openSocketLink([url], createSocket, {
      onOpen: () => undefined,
      onMessage: (text) => {
        for (const packet of parseServerPackets(text)) handle(packet);
        onChange();
      },
      onClose: () => {
        link = null;
        linked = false;
        if (!ended) reconnector.schedule();
        onChange();
      },
    });
  };

  const reconnector = createReconnector(connect);

  connect();

  return {
    get progress() { return total === null ? null : { checked: checked.size, total }; },
    get linked() { return linked; },
    close() {
      ended = true;
      reconnector.stop();
      linked = false;
      link?.close();
    },
  };
};

export { createTrackerLink };
