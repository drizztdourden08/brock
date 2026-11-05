/* @layer core @kind logic */
import type { OnlineConnection } from '../client/online-host.type';
import { createNetworkFacts } from './facts';
import { createLifecycle } from './network-lifecycle';
import type { NetworkMonitor, NetworkMonitorDeps } from './network-monitor.type';
import { buildNetworkStatus } from './network-status';
import { notifyListeners } from './notify-listeners';
import { observeServer } from './observe-server';
import { createPinger } from './ping';
import { createPresence } from './presence';
import { createRoster } from './roster';
import { createTrackerLinks } from './tracker-links';

const createNetworkMonitor = (deps: NetworkMonitorDeps): NetworkMonitor => {
  const { send, createSocket, uuid, now = Date.now } = deps;
  const facts = createNetworkFacts();
  const presence = createPresence();
  const listeners = new Set<() => void>();
  let pinging = false;
  let address: string | null = null;
  let current: OnlineConnection | null = null;

  const emit = (): void => notifyListeners(listeners);
  const changed = (): void => {
    if (!pinging && facts.connection === 'connected' && facts.slot !== null) {
      pinging = true;
      pinger.start(facts.slot);
      roster.query();
    }
    emit();
  };
  const pinger = createPinger({ send, onSample: changed, now });
  const trackers = createTrackerLinks({
    facts, createSocket, connection: () => current, url: () => address, uuid, onChange: changed,
  });
  const roster = createRoster({
    facts, presence, send, isLinked: trackers.isLinked,
    onSettled: () => {
      trackers.open();
      changed();
    },
  });
  const forgetConnection = (): void => {
    pinging = false;
    pinger.reset();
    roster.reset();
    trackers.closeAll();
    presence.clear();
  };
  const remember = (url: string | null, connection: OnlineConnection | null): void => {
    address = url;
    current = connection;
  };

  return {
    status: () => buildNetworkStatus({ facts, ping: pinger, presence, trackers }),
    subscribe(f) {
      listeners.add(f);
      return () => { listeners.delete(f); };
    },
    received(packet) {
      observeServer(facts, packet, now());
      if (packet.cmd === 'Bounced' && pinger.handleBounced(packet)) return true;
      if (packet.cmd === 'PrintJSON') presence.handlePrint(packet, facts.team);
      roster.received(packet);
      changed();
      return false;
    },
    sent(packet) {
      if (packet.cmd === 'LocationChecks') for (const id of packet.locations) facts.sentChecks.add(id);
    },
    changed,
    ...createLifecycle({ facts, changed, forgetConnection, remember, now }),
  };
};

export { createNetworkMonitor };
