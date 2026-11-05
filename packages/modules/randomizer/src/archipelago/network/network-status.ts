/* @layer core @kind logic */
import { buildNetworkPlayers } from './network-players';
import { sentToOthers } from './sent-to-others';
import type { NetworkStatus } from './network-status.type';
import type { NetworkStatusInput } from './network-status-input.type';

const buildNetworkStatus = (input: NetworkStatusInput): NetworkStatus => {
  const { facts, ping } = input;
  return {
    connection: facts.connection,
    health: {
      ...(ping.lastMs === null ? {} : { pingMs: ping.lastMs }),
      ...(ping.meanMs === null ? {} : { pingMeanMs: ping.meanMs }),
      pingSamples: ping.samples,
      ...(facts.lastPacketAt === null ? {} : { lastPacketAt: facts.lastPacketAt }),
    },
    reconnect: {
      attempt: facts.reconnectAttempt,
      nextRetryAt: facts.nextRetryAt,
      inFlight: facts.retryInFlight,
    },
    players: buildNetworkPlayers(input),
    server: {
      ...(facts.serverVersion === null ? {} : { version: facts.serverVersion }),
      ...(facts.seedName === null ? {} : { seedName: facts.seedName }),
      ...(facts.hintPoints === null ? {} : { hintPoints: facts.hintPoints }),
      tags: facts.tags,
    },
    progress: {
      checked: facts.checked.size,
      total: facts.checked.size + facts.missing.size,
      received: facts.itemsReceived,
      sentToOthers: sentToOthers(facts),
    },
  };
};

export { buildNetworkStatus };
