/* @layer core @kind logic */
import { buildNetworkPlayers } from './network-players';
import type { NetworkStatus } from './network-status.type';
import type { NetworkStatusInput } from './network-status-input.type';

const buildNetworkStatus = (input: NetworkStatusInput): NetworkStatus => {
  const { facts, ping } = input;
  return {
    connection: facts.connection,
    health: {
      ...(ping.lastMs === null ? {} : { pingMs: ping.lastMs }),
      ...(facts.lastPacketAt === null ? {} : { lastPacketAt: facts.lastPacketAt }),
    },
    players: buildNetworkPlayers(input),
    server: {
      ...(facts.serverVersion === null ? {} : { version: facts.serverVersion }),
      ...(facts.seedName === null ? {} : { seedName: facts.seedName }),
      tags: facts.tags,
    },
    progress: {
      checked: facts.checked.size,
      total: facts.checked.size + facts.missing.size,
      received: facts.itemsReceived,
    },
  };
};

export { buildNetworkStatus };
