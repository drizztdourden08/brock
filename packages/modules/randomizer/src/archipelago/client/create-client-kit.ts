/* @layer core @kind logic */
import { createLocalStorageCache } from '../data-package/local-storage-cache';
import { createNameTables } from '../data-package/name-tables';
import { createDeathLinkSwitch } from '../deathlink/death-link-switch';
import { createGoalReporter } from '../goal/goal';
import { clientUuid } from '../handshake/client-uuid';
import { createConnectionNotices } from '../messages/connection-notices';
import { createMessageLog } from '../messages/message-log';
import { createNetworkMonitor } from '../network/network-monitor';
import type { ApClientPacket } from '../protocol/client-packets.type';
import { createOnlineRoom } from '../room/create-online-room';
import { createBrowserSocket } from '../socket/browser-socket';
import type { ClientDeps } from './client-deps.type';
import type { ClientEvent } from './client-event.type';
import type { ClientKit } from './client-kit.type';
import { createClientState } from './create-client-state';
import { createListenerSet } from './listener-set';

const createClientKit = (deps: ClientDeps): ClientKit => {
  const full: ClientDeps = { ...deps, cache: deps.cache ?? createLocalStorageCache() };
  const state = createClientState();
  const events = createListenerSet<[ClientEvent]>();
  const createSocket = full.createSocket ?? createBrowserSocket;
  const sendRaw = (packet: ApClientPacket): void => state.link?.send(JSON.stringify([packet]));
  const network = createNetworkMonitor({ send: sendRaw, createSocket, uuid: clientUuid, now: full.now });
  const send = (packet: ApClientPacket): void => {
    sendRaw(packet);
    network.sent(packet);
  };
  const log = (line: string, level?: 'warn' | 'error'): void => full.log?.(line, level);
  const emit = (event: ClientEvent): void => events.emit(event);
  const notifyConnection = createConnectionNotices((notice) => emit({ type: 'notice', notice }));
  const names = createNameTables();
  return {
    deps: full,
    state,
    room: createOnlineRoom(),
    names,
    messages: createMessageLog(),
    goal: createGoalReporter(send),
    network,
    deathLinks: createDeathLinkSwitch({
      send,
      slotName: () => state.connection?.slotName ?? '',
      host: full.host,
      log,
      notify: (notice) => emit({ type: 'death-link', notice }),
      now: full.now,
    }),
    events,
    createSocket,
    send,
    log,
    emit,
    notifyConnection,
  };
};

export { createClientKit };
