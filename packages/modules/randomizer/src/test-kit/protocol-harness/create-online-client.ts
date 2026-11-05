/* @layer core @kind logic */
import { createArchipelagoClient, createLocalStorageCache } from '../../archipelago';
import type { OnlineConnection } from '../../archipelago';
import { createReceivedQueue } from '../../session';
import type { FakeCore } from '../fake-core';
import { hashText } from '../fake-core';
import type { HarnessDeps } from './harness-adapter.type';
import type { HarnessConfig, HarnessSession } from './harness-session.type';
import { connectionErrorOf, statusOf } from './harness-status';

const connectionOf = (config: HarnessConfig): OnlineConnection => ({
  url: config.url,
  slotName: config.slotName,
  deathLink: config.deathLink ?? false,
  trackOtherPlayers: config.trackOtherPlayers ?? false,
  ...(config.password !== undefined ? { password: config.password } : {}),
});

const queueOf = (core: FakeCore): ReturnType<typeof createReceivedQueue> => {
  const store = {
    read: () => ({ receivedIndex: core.readReceivedIndex(), roomHash: hashText(core.readRoomHash()) }),
    write: (cursor: { receivedIndex: number; roomHash: string }) => {
      core.host.writeCursor({ index: cursor.receivedIndex, roomHash: cursor.roomHash });
    },
  };
  return createReceivedQueue({ store, roomHash: () => store.read().roomHash });
};

const createOnlineClient = (config: HarnessConfig, deps: HarnessDeps): HarnessSession => {
  const { core, createSocket, adapter } = deps;
  const received = queueOf(core);
  core.port = received;
  let placement: unknown = null;
  const client = createArchipelagoClient({
    ...adapter, host: core.host, received, createSocket, cache: createLocalStorageCache(),
    placed: (next) => { placement = next; },
  });
  core.report = (id) => client.reportCheck(id);
  const lastReason = { text: '' };
  client.onEvent((event) => {
    if (event.type === 'disconnected') lastReason.text = event.reason;
    if (event.type === 'connected') lastReason.text = '';
  });
  return {
    client,
    get status() { return statusOf(client.status().connection); },
    get messages() { return client.messages(); },
    get placement() { return placement; },
    get networkStatus() {
      const status = client.status();
      return { ...status, connection: { state: status.connection, error: connectionErrorOf(status.connection, lastReason.text) } };
    },
    start: () => {
      client.connect(connectionOf(config));
      return Promise.resolve();
    },
    stop: () => client.close(),
  };
};

export { createOnlineClient };
